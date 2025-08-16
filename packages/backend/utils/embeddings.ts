import OpenAI from "openai";
import * as fs from "fs/promises"; 
import type { QuoteEmbeddingRow } from "../types/quote-row.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const embedBatch = async (quotes: string[]) => {
    try {
        const response = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: quotes,
                encoding_format: "float",
            });

        return response.data.map((e: { embedding: Array<number>; }) => e.embedding)
    }
    catch(e) {
        console.log(quotes)
        throw e
    }
}

export const getEmbeddingsForCharacter = async (character: string): Promise<QuoteEmbeddingRow[]> => {
    
    const text = await fs.readFile(`${process.cwd()}/data/ot_index.json`, 'utf8');

    const items: QuoteEmbeddingRow[] = JSON.parse(text);

    return items.filter(r => r.character === character);
}