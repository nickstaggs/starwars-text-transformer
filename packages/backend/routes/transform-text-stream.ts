import { Router } from 'express';
import OpenAI from 'openai';
import { embedBatch, getEmbeddingsForCharacter } from '../utils/embeddings.js';
import { mapDropdownNameToDialogueName } from '../utils/character-converter.js';
import { dotProduct } from '../utils/vector.js';
import type { QuoteEmbeddingRow } from '../types/quote-row.js';
import { Response } from 'express';
import { ResponseCreateParamsStreaming } from 'openai/resources/responses/responses.mjs';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.OPENAI_MODEL || 'gpt-5';

type QuoteEmbeddingScoreRow = QuoteEmbeddingRow & {score: number}

export const createTransformTextStreamRouter = () => {
  const router = Router();

  const systemPrompt = (style: string) => `You are a text transformer app that rewrites user text in the style of the Star Wars character ${style}. 
    You only provide a single response option for the rewritten text. 
    Don't write star or wars in the reponse unless it makes sense to do so.
    Don't use words from the user's text if the character wouldn't use them.`

  router.post('/stream', async (req, res) => {
    const { style, text } = req.body ?? {};
    if (!style || !text) return res.status(400).end('Missing style or text');

    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const reqParams = {
      model,
      reasoning: { effort: 'minimal' },
      stream: true,
      input: [
        { role: 'system', content: [{ type: 'input_text', text: systemPrompt(style) }] },
        { role: 'user',   content: [{ type: 'input_text', text }] },
      ],
    } as ResponseCreateParamsStreaming

    makeStreamRequest(reqParams, res)
    
  });

  router.post('/streamWithContext', async (req, res) => {
    const { style, text } = req.body ?? {};
    if (!style || !text) return res.status(400).end('Missing style or text');

    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    const sampleQuotes = getAdditionalContext(style, text, 10)

    const prompt = `Rewrite the following line:"${text}"\n\nHere are some json objects of a sample quote and their cosine similarity score to the user's quote from the character and the quotes should be used to inpire the rewritten text are:\n${(await sampleQuotes).map(q => ({quote: q.quote, score: q.score})).join("\n")}`

    const reqParams = {
      model,
      reasoning: { effort: 'medium' },
      stream: true,
      input: [
        { role: 'system', content: [{ type: 'input_text', text: systemPrompt(style) }] },
        { role: 'user',   content: [{ type: 'input_text', text: prompt }]},
      ],
    } as ResponseCreateParamsStreaming

    makeStreamRequest(reqParams, res, await sampleQuotes)
  })

  return router;
};

const makeStreamRequest = async (reqParams: ResponseCreateParamsStreaming, res: Response, context: QuoteEmbeddingScoreRow[] = []) => {
  
  const keepAlive = setInterval(() => res.write('\n'), 15000); // comment ping

    try {
      const stream = await client.responses.create(reqParams);

      for await (const evt of stream) {
        if (evt.type === 'response.output_text.delta') {
          res.write(`${JSON.stringify(evt)}\n`);
        } else if (evt.type === 'response.completed') {
          break;
        }
      }

      if (context.length > 0) {
        context.forEach(l => {
          res.write(`${JSON.stringify({context: {quote: l.quote, movie: l.movie, score: l.score}})}\n`)
        })
      }
    } catch (e) {
      console.error(`event: error, data: ${JSON.stringify({ error: String(e) })}`);

    } finally {
      clearInterval(keepAlive);
      res.end();
    }
}

const getAdditionalContext = async (character: string, text: string, k: number | undefined): Promise<QuoteEmbeddingScoreRow[]> => {
  const userEmbedding = (await embedBatch([text]))[0]
  const characterQuotes = getEmbeddingsForCharacter(mapDropdownNameToDialogueName(character)!)

  return (await characterQuotes).map(r => ({ ...r, score: dotProduct(userEmbedding, r.embedding) }))
                    .sort((a,b) => b.score - a.score)
                    .slice(0, k);
}