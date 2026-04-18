import { useEffect, useState } from 'react';
import { PartyPopper } from 'lucide-react';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Confetti() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const colors = ['#00C3AA', '#3B82F6', '#A855F7', '#F97316', '#22C55E', '#EC4899', '#FBBF24', '#EF4444'];
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: randomBetween(10, 90),
      y: randomBetween(-20, 40),
      color: colors[i % colors.length],
      size: randomBetween(6, 12),
      rotation: randomBetween(0, 360),
      delay: Math.random() * 0.5,
      duration: randomBetween(1500, 2500),
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            borderRadius: p.size > 9 ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}ms`,
          }}
        />
      ))}
      
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl px-8 py-6 text-center animate-confetti-pop">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3">
          <PartyPopper size={32} className="text-white" />
        </div>
        <p className="text-2xl font-bold text-slate-800">🎉 恭喜拿到 Offer！</p>
        <p className="text-sm text-slate-500 mt-1">太棒了，继续加油！</p>
      </div>
    </div>
  );
}

export default Confetti;
