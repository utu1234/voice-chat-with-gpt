# 🎙️ My Voice App – Offline-Capable Voice Assistant with AI

My Voice App is a **Next.js + TypeScript** offline-capable voice assistant. It records voice input, transcribes speech **locally using Whisper WASM**, sends the transcribed text to **OpenAI’s Chat Completion API**, and then **converts the response back to speech locally using TTS (Text-to-Speech)** — all with minimal latency.

>  Works offline after initial load (except OpenAI API call)  
>  Built for speed – under 1.2s total response time target  
>  Perfect for PWAs and local-first AI applications

---

##  Features

- 🎤 **Local Speech-to-Text** using `whisper.cpp` (WASM) in a Web Worker
- 🧠 **OpenAI Chat Integration** for intelligent responses
- 🔊 **Local Text-to-Speech** using Coqui-style TTS model (WASM)
- 🔁 **STT → LLM → TTS pipeline** triggered on end-of-speech
- 📶 **Offline support** via Service Worker & pre-caching
- 🧾 **Performance logs** showing latency for STT, LLM, TTS, and playback

---

##  Tech Stack

| Tech              | Usage                            |
|-------------------|----------------------------------|
| Next.js + TypeScript | Web application framework       |
| Web Workers       | STT and TTS processing            |
| Whisper.cpp (WASM) | Local transcription               |
| Coqui TTS (WASM)  | Local audio synthesis             |
| OpenAI API        | AI chat response (cloud-based)    |
| Tailwind CSS      | UI styling (optional)             |
| Service Worker + Manifest | Offline capabilities         |

---

##  Installation

### 1. Clone this repo

```bash
git clone https://github.com/utu1234/my-voice-app.git
cd my-voice-app



🚫 Note:
Due to OpenAI API quota exhaustion and billing limitations, the current demo uses a simulated GPT reply instead of a live API call. The entire pipeline—microphone input, Whisper-based local transcription, Coqui-style TTS, and offline caching—is implemented and functional. GPT integration is complete in code, and switching to live API requires only a valid API key.
