export interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
  speaker?: "judy" | "andrew";
}

export interface WordChunk {
  words: WordTimestamp[];
  startMs: number;
  endMs: number;
}
