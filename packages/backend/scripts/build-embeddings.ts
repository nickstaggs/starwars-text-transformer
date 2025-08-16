import fs from "fs/promises";
import path from "path";
import 'dotenv/config';
import { fileURLToPath } from "url";
import { embedBatch } from "../utils/embeddings";
import type { QuoteEmbeddingRow, QuoteRow } from "../types/quote-row.ts";

//TODO: fix path
const __dirname = path.dirname(fileURLToPath("import.meta.url"));
const SRC = path.resolve(__dirname, "../../../Text_files");
const FILES = ["EpisodeIV_dialogues.txt", "EpisodeV_dialogues.txt", "EpisodeVI_dialogues.txt"];

function parseLine(raw: string) {
  if (!raw.trim()) return null;
  // Try TSV: "CHARACTER\tline"
  if (raw.includes("\t")) {
    const [character, text] = raw.split("\t");
    return { character: character.trim(), text: text.trim() };
  }
  // Fallback: "CHARACTER: line"
  const i = raw.indexOf(":");
  if (i > 0) return { character: raw.slice(0, i).trim(), text: raw.slice(i + 1).trim() };
  return null;
}

function getMovieName(fileName: string) {
  if (fileName.includes("IV")) return "Episode IV";
  if (fileName.includes("V")) return "Episode V";
  return "Episode VI";
}

async function run() {
  const rows: QuoteRow[] = [];
  for (const f of FILES) {
    const movie = getMovieName(f);
    const content = await fs.readFile(path.join(SRC, f), "utf8");
    const lines = content.split(/\r?\n/).map(parseLine).filter(l => Boolean(l) && l?.text !== '');
    lines.forEach((r, idx) => rows.push({
      id: `${movie}:${idx}`,
      movie,
      character: r!.character.toUpperCase(),
      quote: r!.text
    }));
  }

  // embed in batches
  const out: QuoteEmbeddingRow[] = [];
  const batchSize = 100
  let batchNum = 1
  const batches = Math.ceil(rows.length/batchSize)
  for (let i = 0; i < rows.length; i += batchSize) {
    console.log(`Starting batch ${batchNum} of ${batches}`)
    const batch = rows.slice(i, i + batchSize);
    const embs = await embedBatch(batch.map(r => r.quote));
    for (let j = 0; j < batch.length; j++) out.push({ ...batch[j], embedding: embs[j] });
    batchNum++
  }

  await fs.mkdir(path.resolve(__dirname, "../data"), { recursive: true });
  await fs.writeFile(path.resolve(__dirname, "../data/ot_index.json"), JSON.stringify(out), "utf8");
  console.log(`Wrote ${out.length} rows to data/ot_index.json`);
}

run().catch(err => { console.error(err); process.exit(1); });