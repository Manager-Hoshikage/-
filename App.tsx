
import React, { useState, useEffect } from 'react';
import { PHILOSOPHICAL_THEMES, STAR_IMAGE_POOL, REFLECTIVE_MESSAGES } from './constants';

interface ShootingStar {
  id: number;
  text: string;
}

const App: React.FC = () => {
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [theme, setTheme] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [isSent, setIsSent] = useState<boolean>(false);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);
  const [currentStarImages, setCurrentStarImages] = useState<string[]>([]);
  const [reflectiveMessage, setReflectiveMessage] = useState<string>('');

  // 3枚のカード画像をランダムに選ぶ
  const shuffleImages = () => {
    const shuffled = [...STAR_IMAGE_POOL].sort(() => 0.5 - Math.random());
    setCurrentStarImages(shuffled.slice(0, 3));
  };

  useEffect(() => {
    shuffleImages();
  }, []);

  const handleStarClick = (index: number) => {
    if (selectedStar !== null) return;
    setSelectedStar(index);
    const randomTheme = PHILOSOPHICAL_THEMES[Math.floor(Math.random() * PHILOSOPHICAL_THEMES.length)];
    setTheme(randomTheme);
  };

  const handleSendAnswer = () => {
    if (!userInput.trim()) return;
    
    const fullAnswer = `私は${userInput.trim()}だと思う`;
    
    const newStar: ShootingStar = {
      id: Date.now(),
      text: fullAnswer
    };
    
    const msg = REFLECTIVE_MESSAGES[Math.floor(Math.random() * REFLECTIVE_MESSAGES.length)];
    setReflectiveMessage(msg);
    
    setShootingStars(prev => [...prev, newStar]);
    setIsSent(true);
    
    // アニメーションが終わる頃に消去
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== newStar.id));
    }, 1500);
  };

  const handleReset = () => {
    setSelectedStar(null);
    setTheme('');
    setUserInput('');
    setIsSent(false);
    setReflectiveMessage('');
    shuffleImages(); // リセット時に画像をシャッフル
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden text-center">
      {/* 答えが飛んでいく流れ星 */}
      {shootingStars.map(star => (
        <div 
          key={star.id} 
          className="shooting-star" 
          style={{ top: '60%', left: '45%' }}
        >
          <span className="absolute -top-10 left-0 text-xl text-white font-medium whitespace-nowrap drop-shadow-[0_0_10px_rgba(255,255,255,0.9)]">
            {star.text}
          </span>
        </div>
      ))}

      <header className="mb-10 fade-in">
        <h1 className="title-font text-3xl md:text-5xl text-blue-100 mb-6 drop-shadow-[0_0_10px_rgba(191,219,254,0.4)]">
          プラネタリウム 索星館
        </h1>
        <p className="text-blue-200/80 text-sm md:text-lg tracking-[0.2em] font-light">
          カードを1枚選んで、考えを旅させよう
        </p>
      </header>

      <main className="w-full max-w-4xl flex flex-col items-center">
        <section className="mb-12 w-full flex flex-col items-center">
          <h2 className="text-lg md:text-2xl mb-10 text-white/90 tracking-widest font-light">
            {selectedStar === null ? "どの星の問いを聞く？" : "選んだ星からの問いかけ"}
          </h2>
          
          <div className="card-container">
            {currentStarImages.map((src, idx) => (
              <div 
                key={`${src}-${idx}`}
                onClick={() => handleStarClick(idx)}
                className={`
                  relative cursor-pointer transition-all duration-700 rounded-xl overflow-hidden
                  w-24 h-40 md:w-44 md:h-72 border-2 border-white/20 glow-card flex-shrink-0
                  ${selectedStar === idx ? 'ring-4 ring-white/60 scale-105 z-10 border-white/80' : ''}
                  ${selectedStar !== null && selectedStar !== idx ? 'opacity-10 grayscale scale-90 cursor-default pointer-events-none' : ''}
                `}
              >
                <img 
                  src={src} 
                  alt={`Star ${idx + 1}`} 
                  className="w-full h-full object-cover brightness-110 contrast-125"
                />
                <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors"></div>
              </div>
            ))}
          </div>
        </section>

        {selectedStar !== null && (
          <section className="w-full max-w-2xl bg-black/60 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-3xl fade-in shadow-2xl flex flex-col items-center">
            <div className="mb-8 w-full">
              <span className="inline-block px-5 py-1.5 bg-white/10 text-blue-100 text-xs rounded-full mb-6 uppercase tracking-[0.3em] border border-white/10 font-light">Question from the stars</span>
              <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed tracking-wider px-2">
                {theme}
              </h3>
            </div>

            {!isSent ? (
              <div className="w-full space-y-6 flex flex-col items-center">
                <div className="relative w-full group">
                  <div className="absolute top-4 left-6 text-blue-200/50 pointer-events-none font-bold text-lg">私は</div>
                  <textarea
                    className="w-full h-44 bg-white/5 border border-white/20 rounded-2xl pt-12 pb-12 px-6 text-white text-lg placeholder-white/5 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all resize-none shadow-inner text-center leading-relaxed"
                    placeholder="..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <div className="absolute bottom-4 right-6 text-blue-200/50 pointer-events-none font-bold text-lg">だと思う</div>
                </div>
                <button
                  onClick={handleSendAnswer}
                  disabled={!userInput.trim()}
                  className="w-full max-w-sm py-4 bg-white text-blue-950 font-bold rounded-full shadow-2xl hover:bg-blue-50 transition-all transform active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed tracking-[0.4em] text-lg"
                >
                  この答えで旅する
                </button>
              </div>
            ) : (
              <div className="w-full py-4 fade-in flex flex-col items-center">
                <p className="text-lg md:text-2xl text-blue-50 mb-12 italic leading-relaxed px-4 drop-shadow-lg">
                  {reflectiveMessage}
                </p>
                <button
                  onClick={handleReset}
                  className="px-14 py-4 bg-white/10 hover:bg-white/20 border border-white/30 text-white rounded-full transition-all flex items-center gap-4 tracking-[0.3em] text-lg active:scale-95"
                >
                  <span>次の星に行く</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="mt-auto pt-16 pb-8 text-white/30 text-[10px] tracking-[0.6em] uppercase">
        プラネタリウム 索星館
      </footer>
    </div>
  );
};

export default App;
