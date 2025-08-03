import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  text: string;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;  
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  onPlaybackStart,
  onPlaybackEnd,
}) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const ttsWorkerRef = useRef<Worker | null>(null);

  useEffect(() => {
    ttsWorkerRef.current = new Worker(
      new URL('../workers/ttsWorker.ts', import.meta.url),
      { type: 'module' }
    );

    ttsWorkerRef.current.postMessage({ command: 'init' });

    ttsWorkerRef.current.onmessage = (e) => {
      const { audioUrl } = e.data;
      if (audioUrl) {
        setAudioUrl(audioUrl);
      }
    };

    return () => {
      ttsWorkerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    if (text && ttsWorkerRef.current) {
      ttsWorkerRef.current.postMessage({
        command: 'synthesize',
        text,
      });
    }
  }, [text]);

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      {audioUrl ? (
        <audio
          controls
          autoPlay
          src={audioUrl}
          className="w-full max-w-md"
          onPlay={() => {
            if (onPlaybackStart) onPlaybackStart();
          }}
          onEnded={() => {
            if (onPlaybackEnd) onPlaybackEnd();
          }}
        />
      ) : (
        <p className="text-sm text-gray-200 italic">Generating audio...</p>
      )}
    </div>
  );
};

export default AudioPlayer;
