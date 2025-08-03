

export {}; 

self.onmessage = async (e) => {
  const { command, audioChunk } = e.data;

  if (command === 'init') {
    
    self.postMessage({ status: 'ready' });
  }

  if (command === 'transcribe') {
    
    const dummyTranscript = "यह एक डेमो ट्रांसक्रिप्ट है";
    self.postMessage({ transcript: dummyTranscript });
  }
};
