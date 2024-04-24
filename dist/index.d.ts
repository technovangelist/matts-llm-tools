export declare function getFileNames(filepath: string, namePattern: string, sortFunction?: (a: string, b: string) => number): Promise<string[]>;
export declare function chunkTextBySentences(sourceText: string, sentencesPerChunk: number, overlap: number): string[];
export declare function latestModelGetter(modelName: string): Promise<void>;
export declare function jsonhash(json: string): Promise<string>;
