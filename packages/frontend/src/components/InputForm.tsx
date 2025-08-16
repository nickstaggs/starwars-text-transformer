import React from 'react';
import PromptInput from './PromptInput';
import ContextToggle from './ContextToggle';

interface InputFormProps {
  style: string;
  text: string;
  withContext: boolean;
  onStyleChange: (style: string) => void;
  onTextChange: (text: string) => void;
  toggleWithContext: () => void;
  onSubmit: (style: string, text: string, withContext: boolean) => void;
  isStreaming: boolean;
}

const InputForm: React.FC<InputFormProps> = ({
  style,
  text,
  withContext,
  onStyleChange,
  onTextChange,
  toggleWithContext,
  onSubmit,
  isStreaming,
}) => {
    const characters = [
        "Luke Skywalker",
        "Princess Leia",
        "Han Solo",
        "Obi-wan Kenobi",
        "Yoda",
        "Darth Vader",
        "Emperor Palpatine",
        "C-3PO",
        "Lando Calrissian"
    ];

    const handleSubmit = () => {
        if (style.trim() === '' || text.trim() === '') {
            alert('Please enter text/style to transform');
            return
        }

        onSubmit(style,text, withContext)
    }

  return (
    <div className="input-form">
      <div className="form-group">
        <label htmlFor="style-input">Style</label>
        <select
          id="style-input"
          value={style}
          onChange={(e) => onStyleChange(e.target.value)}
          disabled={isStreaming}
        >
          <option value="">Select a character</option>
          {characters.map((character) => (
            <option key={character} value={character}>
              {character}
            </option>
          ))}
        </select>
        <ContextToggle
          withContext={withContext}
          toggleWithContext={toggleWithContext}
          disabled={isStreaming}
        />
      </div>
      <div className="form-group">
        <label htmlFor="prompt-input">Text to Transform</label>
        <PromptInput
          text={text}
          onTextChange={onTextChange}
          isStreaming={isStreaming}
        />
      </div>
      <button onClick={() => handleSubmit()} disabled={isStreaming}>
        {isStreaming ? 'Streaming...' : 'Transform'}
      </button>
    </div>
  );
};

export default InputForm;