// src/components/Recorder.tsx

import React, { useEffect, useRef, useState } from 'react';

interface RecorderProps {
  onFinalTranscript: (text: string) => void;
  onSTTStart?: () => void; 
}

const Recorder: React.FC<RecorderProps> = ({ onFinalTranscript, onSTTStart }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const whisperWorkerRef = useRef<Worker | null>(null);

  // Load and initialize Whisper Worker
  useEffect(() => {
    whisperWorkerRef.current = new Worker(
      new URL('../workers/whisperWorker.ts', import.meta.url),
      { type: 'module' }
    );

    whisperWorkerRef.current.postMessage({ command: 'init' });

    whisperWorkerRef.current.onmessage = (e) => {
      const { transcript } = e.data;
      if (transcript) {
        onFinalTranscript(transcript);
      }
    };

    return () => {
      whisperWorkerRef.current?.terminate();
    };
  }, [onFinalTranscript]);

  // Start Recording
  const startRecording = async () => {
    setRecording(true);

    // STT Start callback
    onSTTStart?.(); // Call if provided

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const arrayBuffer = await audioBlob.arrayBuffer();

      whisperWorkerRef.current?.postMessage({
        command: 'transcribe',
        audioChunk: arrayBuffer,
      });
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
      setRecording(false);
    }, 5000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={startRecording}
        disabled={recording}
        className="bg-pink-600 hover:bg-pink-700 px-6 py-2 rounded-full text-white font-bold shadow-lg transition"
      >
        🎤 {recording ? 'Recording...' : 'Start Recording'}
      </button>
    </div>
  );
};

export default Recorder;
