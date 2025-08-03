

export {}; 

self.onmessage = async (e) => {
  const { command, text } = e.data;

  if (command === 'init') {
    
    self.postMessage({ status: 'ready' });
  }

  if (command === 'synthesize') {
    

    
    const demoAudioUrl = '/crowd-cheering.mp3'; 
    self.postMessage({ audioUrl: demoAudioUrl });
  }
};
