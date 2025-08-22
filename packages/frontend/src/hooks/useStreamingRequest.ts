import { useState } from "react";

const useStreamingRequest = () => {
    const [transformedText, setTransformedText] = useState('');
    const [contextObjects, setContextObjects] = useState<{quote: string, movie: string, score: number}[]>([]);
    const [isStreaming, setIsStreaming] = useState(false);

    const startStreaming = async (style: string, text: string, withContext: boolean) => {
        setTransformedText('');
        setContextObjects([]);
        setIsStreaming(true);

        const url = 'api/transform-text/stream' + (withContext ? 'withContext' : '')

        const resp = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ style, text }),
        });

        if (!resp.ok) {
            setIsStreaming(false);
            setTransformedText('Oops, something went wrong!');
            return;
        }

        const decoder = new TextDecoder();

        try {
            if (resp.body) {
                const reader = resp.body.getReader();
                let partialLine = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }

                    const data = partialLine + decoder.decode(value, { stream: true });
                    const lines = data.split('\n');
                    
                    partialLine = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim() !== '') {
                            const { delta, context } = JSON.parse(line);
                            if (delta) {
                                const deltaArray = delta.split('');
                                for await(const char of deltaArray) {
                                    await new Promise(resolve => setTimeout(resolve, 35));
                                    setTransformedText((prev) => prev + char);
                                }
                            }
                            if (context) {
                                setContextObjects(c => [...c, context])
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            setTransformedText('Oops, something went wrong!');
        } finally {
            setIsStreaming(false);
        }
    };

    return { startStreaming, isStreaming, transformedText, contextObjects };
}

export default useStreamingRequest;