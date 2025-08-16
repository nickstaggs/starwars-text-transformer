import React from 'react';
import CopyButton from './CopyButton';

interface OutputDisplayProps {
  transformedText: string;
  isStreaming: boolean;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ transformedText, isStreaming }) => {


  return (
    <div className="output-display">
      <h2>Transformed Text</h2>
      <div className="transformed-text-container">
        <pre className="transformed-text">{
          transformedText
        }
        {isStreaming && <span className="thinking-indicator"></span>}
        </pre>
      </div>
      { !isStreaming && transformedText.trim() !== '' && <CopyButton textToCopy={transformedText} />}
    </div>
  );
};

export default OutputDisplay;