import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Music, Volume2, ArrowRight } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import confetti from 'canvas-confetti';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const VOICE_NAMES = {
  BABY: 'Kore',
  SWEET: 'Puck'
};

export default function App() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const playTTS = useCallback(async (text: string, voiceName: string) => {
    try {
      setIsPlaying(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => {
          setIsPlaying(false);
          setShowButton(true);
        };
        await audio.play();
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlaying(false);
      setShowButton(true); // Show button anyway if TTS fails
    }
  }, []);

  useEffect(() => {
    if (step === 1) {
      setShowButton(false);
      playTTS("For the best girl in the world", VOICE_NAMES.BABY);
    } else if (step === 2) {
      setShowButton(false);
      playTTS("For lover of king of stock market, kamal Belbase", VOICE_NAMES.SWEET);
    } else if (step === 3) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [step, playTTS]);

  const nextStep = () => {
    setStep(s => s + 1);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center overflow-hidden font-sans relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: Math.random() * 100 + 'vw', opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 1, 1, 0],
              rotate: 360,
              x: [null, (Math.random() - 0.5) * 100 + 'vw']
            }}
            transition={{ 
              duration: Math.random() * 15 + 10, 
              repeat: Infinity, 
              delay: Math.random() * 20,
              ease: "linear"
            }}
            className="absolute"
          >
            {i % 2 === 0 ? (
              <Heart size={Math.random() * 30 + 15} className="text-pink-200" fill="currentColor" />
            ) : (
              <Sparkles size={Math.random() * 20 + 10} className="text-yellow-200" />
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 text-center p-8"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-6 inline-block"
            >
              <Heart size={80} className="text-red-500" fill="currentColor" />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4 tracking-tight">
              I'm So Sorry...
            </h1>
            <p className="text-pink-400 text-lg mb-8 max-w-md mx-auto italic">
              "My heart beats only for you, and it hurts when I make you sad."
            </p>
            <HeartButton onClick={nextStep} text="ENTER MY HEART" />
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 text-center p-8 flex flex-col items-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ 
                  rotate: isPlaying ? [0, -5, 5, -5, 5, 0] : [0, -10, 10, -10, 10, 0],
                  y: isPlaying ? [0, -15, 0, -15, 0] : [0, -20, 0],
                  scale: isPlaying ? [1, 1.1, 1, 1.1, 1] : 1
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: isPlaying ? 0.4 : 1.5,
                  ease: "easeInOut"
                }}
                className="text-9xl"
              >
                🐼
              </motion.div>
              {isPlaying && (
                <motion.div
                  animate={{ scaleY: [0.2, 1, 0.2] }}
                  transition={{ repeat: Infinity, duration: 0.2 }}
                  className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-8 h-4 bg-black rounded-full"
                />
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-2 border-pink-200 mb-8 relative"
            >
              {/* Speech Bubble Tail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l-2 border-t-2 border-pink-200 rotate-45" />
              
              <p className="text-2xl font-serif italic text-pink-700">
                "For the best girl in the world"
              </p>
              {isPlaying && (
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-pink-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
            {showButton && <HeartButton onClick={nextStep} text="ENTER MY HEART" />}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 text-center p-8 flex flex-col items-center"
          >
            <div className="relative mb-8">
              <motion.div
                animate={{ 
                  scale: isPlaying ? [1, 1.15, 1, 1.15, 1] : [1, 1.1, 1],
                  rotate: isPlaying ? [0, 3, -3, 3, -3, 0] : [0, 5, -5, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: isPlaying ? 0.3 : 2,
                  ease: "easeInOut"
                }}
                className="text-9xl"
              >
                🐱
              </motion.div>
              {isPlaying && (
                <motion.div
                  animate={{ scaleY: [0.1, 0.8, 0.1] }}
                  transition={{ repeat: Infinity, duration: 0.25 }}
                  className="absolute bottom-[22%] left-1/2 -translate-x-1/2 w-6 h-3 bg-pink-300 rounded-full"
                />
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl border-2 border-pink-200 mb-8 max-w-lg relative"
            >
              {/* Speech Bubble Tail */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-l-2 border-t-2 border-pink-200 rotate-45" />

              <p className="text-2xl font-serif italic text-pink-700">
                "For lover of king of stock market, kamal Belbase"
              </p>
              {isPlaying && (
                <div className="mt-4 flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, 30, 10] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                      className="w-1 bg-pink-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </motion.div>
            {showButton && <HeartButton onClick={nextStep} text="ENTER MY HEART" />}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 text-center p-8 flex flex-col items-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                filter: ["drop-shadow(0 0 0px #f472b6)", "drop-shadow(0 0 20px #f472b6)", "drop-shadow(0 0 0px #f472b6)"]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mb-8"
            >
              <Heart size={120} className="text-red-600" fill="currentColor" />
            </motion.div>
            
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-6xl md:text-8xl font-black text-red-600 mb-6 tracking-tighter uppercase"
            >
              I LOVE YOU <br />
              <span className="text-pink-500">BINITA</span>
            </motion.h1>

            <div className="flex gap-4 mt-8">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                  className="text-4xl"
                >
                  ✨
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 text-pink-600 font-medium text-xl"
            >
              You are my everything. ❤️
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 p-4 opacity-30">
        <Sparkles className="text-pink-400" size={48} />
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-30">
        <Sparkles className="text-pink-400" size={48} />
      </div>
    </div>
  );
}

function HeartButton({ onClick, text }: { onClick: () => void, text: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="group relative flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg shadow-red-200 transition-colors"
    >
      <Heart className="group-hover:fill-white transition-colors" />
      {text}
      <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      
      {/* Button Glow Effect */}
      <div className="absolute inset-0 rounded-full bg-red-400 blur-lg opacity-0 group-hover:opacity-40 -z-10 transition-opacity" />
    </motion.button>
  );
}
