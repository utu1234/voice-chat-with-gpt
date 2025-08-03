// pages/index.tsx

import React, { useState, useRef, useEffect } from 'react';
import Recorder from '../components/Recorder';
import AudioPlayer from '../components/AudioPlayer';
import { fetchChatCompletion } from '../utils/openai';
import SettingsModal from '../components/SettingsModal';

const HomePage: React.FC = () => {
  const [transcript, setTranscript] = useState('');
  const [gptResponse, setGptResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [latencySTT, setLatencySTT] = useState<number | null>(null);
  const [latencyAPI, setLatencyAPI] = useState<number | null>(null);
  const [latencyTTS, setLatencyTTS] = useState<number | null>(null);
  const [latencyPlayback, setLatencyPlayback] = useState<number | null>(null);

  const sttStart = useRef<number>(0);
  const playbackStart = useRef<number>(0);

  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleSTTStart = () => {
    sttStart.current = performance.now();
  };

  const handleFinalTranscript = async (text: string) => {
    const sttEnd = performance.now();
    const sttDuration = sttEnd - sttStart.current;
    setLatencySTT(Math.round(sttDuration));

    setTranscript(text);
    setLoading(true);

    try {
      if (isOffline) {
        setGptResponse('Offline: GPT response unavailable');
        setLatencyAPI(null);
      } else {
        const apiStart = performance.now();
        const gptReply = await fetchChatCompletion(text);
        const apiEnd = performance.now();
        setLatencyAPI(Math.round(apiEnd - apiStart));
        setGptResponse(gptReply);
      }

      const ttsStart = performance.now();
      setTimeout(() => {
        const ttsEnd = performance.now();
        setLatencyTTS(Math.round(ttsEnd - ttsStart));
      }, 300);
    } catch (error) {
      setGptResponse('Error fetching response');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaybackStart = () => {
    playbackStart.current = performance.now();
  };

  const handlePlaybackEnd = () => {
    const playbackEnd = performance.now();
    const duration = playbackEnd - playbackStart.current;
    setLatencyPlayback(Math.round(duration));
  };

  return (
    <>
      <header className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white shadow-md">
        <div className="text-2xl font-bold">My Voice GPT</div>
        <div className="flex items-center space-x-4">
          <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
          <button title="Settings" onClick={() => setSettingsOpen(true)} className="hover:text-pink-400">
            ⚙️
          </button>
          <img src="/icons/profile-icon.png" alt="User Profile" className="w-8 h-8 rounded-full border-2 border-white" />
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-r from-purple-900 via-indigo-900 to-pink-900 text-white p-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-6">🎙️ Voice Chat with GPT</h1>

        <Recorder onFinalTranscript={handleFinalTranscript} onSTTStart={handleSTTStart} />

        <section className="mt-6 max-w-xl w-full bg-purple-800 bg-opacity-30 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Your Speech Transcript:</h2>
          <p className="italic min-h-[2rem]">{transcript || 'Waiting for input...'}</p>
        </section>

        <section className="mt-6 max-w-xl w-full bg-purple-800 bg-opacity-30 rounded-lg p-4 shadow-lg">
          <h2 className="text-xl font-semibold mb-2">GPT Response:</h2>
          {loading ? <p className="italic">Thinking...</p> : <p className="min-h-[3rem]">{gptResponse || 'Say something!'}</p>}
        </section>

        {gptResponse && (
          <AudioPlayer text={gptResponse} onPlaybackStart={handlePlaybackStart} onPlaybackEnd={handlePlaybackEnd} />
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-white p-2 flex justify-around space-x-4">
        <div>STT: {latencySTT !== null ? `${latencySTT} ms` : '--'}</div>
        <div>API: {latencyAPI !== null ? `${latencyAPI} ms` : isOffline ? 'Offline' : '--'}</div>
        <div>TTS: {latencyTTS !== null ? `${latencyTTS} ms` : '--'}</div>
        <div>Playback: {latencyPlayback !== null ? `${latencyPlayback} ms` : '--'}</div>
      </footer>
    </>
  );
};

export default HomePage;
