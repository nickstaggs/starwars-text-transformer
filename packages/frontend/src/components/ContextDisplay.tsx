import React from 'react';

interface ContextDisplayProps {
  context: {quote:string, movie: string, score: number}[];
}

const ContextDisplay: React.FC<ContextDisplayProps> = ({ context }) => {
  if (context.length === 0) {
    return null; // Don't render anything if there's no context
  }

  return (
    <div className="context-display"> {/* New wrapper div for context section */}
      <h2>Context</h2>
      <div className="context-list">
        {context.map((item, index) => (
          <div key={index} className="context-item">
            <p><strong>Quote:</strong> {item.quote}</p>
            <p><strong>Movie:</strong> {item.movie}</p>
            <p><strong>Score:</strong> {item.score.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextDisplay;
