export interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
}

export interface WordChunk {
  words: WordTimestamp[];
  startMs: number;
  endMs: number;
}
