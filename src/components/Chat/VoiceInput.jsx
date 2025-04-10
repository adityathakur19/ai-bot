
// client/src/components/Chat/VoiceInput.jsx
import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import 'regenerator-runtime/runtime';

const VoiceInput = ({ onTranscription, isEnabled }) => {
  const [isListening, setIsListening] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    if (isEnabled && !isListening) {
      handleStartListening();
    } else if (!isEnabled && isListening) {
      handleStopListening();
    }
  }, [isEnabled]);

  useEffect(() => {
    if (transcript) {
      onTranscription(transcript);
    }
  }, [transcript, onTranscription]);

  const handleStartListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true });
    setIsListening(true);
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <span className="text-sm text-red-500">
        Your browser doesn't support voice input.
      </span>
    );
  }

  return (
    <div className="relative">
      {isListening && (
        <div className="absolute -top-8 left-0 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceInput;