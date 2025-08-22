interface PromptInputProps {
  text: string;
  onTextChange: (text: string) => void;
  isStreaming: boolean;
}

const PromptInput = ({ text, onTextChange, isStreaming }: PromptInputProps) => {
  return (
    <textarea
      id='prompt-input'
      placeholder="Text to transform"
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      disabled={isStreaming}
    />
  );
};

export default PromptInput;