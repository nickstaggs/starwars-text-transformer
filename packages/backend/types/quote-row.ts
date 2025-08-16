export type QuoteRow = {
    id: string
    movie: string
    character: string
    quote: string
};

export type QuoteEmbeddingRow = QuoteRow & {embedding : number[]};
