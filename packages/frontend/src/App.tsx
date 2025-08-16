import { useState } from 'react';
import './App.css';
import InputForm from './components/InputForm';
import OutputDisplay from './components/OutputDisplay';
import ContextDisplay from './components/ContextDisplay';
import useStreamingRequest from "./hooks/useStreamingRequest.ts";

function App() {
  const [style, setStyle] = useState('');
  const [text, setText] = useState('');
  const [withContext, setWithContext] = useState(false)
  const { startStreaming, isStreaming, transformedText, contextObjects } = useStreamingRequest();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Star Wars Text Transformer</h1>
      </header>
      <main>
        <InputForm
          style={style}
          text={text}
          withContext={withContext}
          onStyleChange={setStyle}
          onTextChange={setText}
          toggleWithContext={() => setWithContext(!withContext)}
          onSubmit={startStreaming}
          isStreaming={isStreaming}
        />
        <OutputDisplay
          transformedText={transformedText}
          isStreaming={isStreaming} 
        />
        <ContextDisplay
          context={contextObjects}
        />
      </main>
    </div>
  );
}

export default App;