import fs from 'fs';

import sentencize from "@stdlib/nlp-sentencize";

export async function getFileNames(filepath: string, namePattern: string, sortFunction: (a: string, b: string) => number = (a, b) => a.localeCompare(b)): Promise<string[]> {
  const outFiles: string[] = []
  fs.readdir(filepath, (err, files) => {
    if (err) {
      return `Unable to scan directory: ${err}`;
    }
    files.forEach(file => {
      outFiles.push(file)
    })
  })
  return outFiles.sort(sortFunction);
}

export function chunkTextBySentences(sourceText: string, sentencesPerChunk: number, overlap: number): string[] {
  if (sentencesPerChunk < 2) {
    throw new Error("The number of sentences per chunk must be 2 or more.");
  }
  if (overlap < 0 || overlap >= sentencesPerChunk - 1) {
    throw new Error("Overlap must be 0 or more and less than the number of sentences per chunk.");
  }

  const sentences = sentencize(sourceText)
  if (!sentences) {
    console.log("Nothing to chunk")
    return [];
  }

  const chunks: string[] = [];
  let i = 0;

  while (i < sentences.length) {
    let end = Math.min(i + sentencesPerChunk, sentences.length);
    let chunk = sentences.slice(i, end).join(' ');

    if (overlap > 0 && i > 1) {
      const overlapStart = Math.max(0, i - overlap);
      const overlapEnd = i;
      const overlapChunk = sentences.slice(overlapStart, overlapEnd).join(' ');
      chunk = overlapChunk + ' ' + chunk;
    }

    chunks.push(chunk.trim());

    i += sentencesPerChunk;
  }

  return chunks;
}