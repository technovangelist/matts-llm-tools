import fs from 'fs';
import ollama from 'ollama';
import Hex from 'hex-encoding';
import {createHash} from 'crypto';

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

export async function latestModelGetter(modelName: string): Promise<void> {
  let [repo, tag] = modelName.split(":");
  const localModels = (await ollama.list()).models.map(m => ({ "name": m.name, "digest": m.digest }));

  if (!repo.includes("/")) {
    repo = `library/${repo}`;
  }
  const localdigest = localModels.find(m => m.name === modelName)?.digest;
  if (localdigest) {
    const remoteModelInfo = await fetch(`https://ollama.ai/v2/${repo}/manifests/${tag}`, {
      headers: {
        "Accept": "application/vnd.docker.distribution.manifest.v2+json"
      }
    })
    if (remoteModelInfo.status === 200) {
      const remoteModelInfoJson = await remoteModelInfo.json();
      const hash = await jsonhash(remoteModelInfoJson as string);
      if (localdigest !== hash) {
        await ollama.pull({model: modelName, stream: false})
      }
    }
  } else {
    await ollama.pull({model: modelName, stream: false})
  }

}

export async function jsonhash(json: string) {
  const jsonstring = JSON.stringify(json).replace(/\s+/g, '')
  const hash = createHash('sha256');
  hash.update(jsonstring);
  const hexString = hash.digest('hex');

  return hexString
}