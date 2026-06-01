import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Swords, Wind } from 'lucide-react';

const WARRIOR_IMG = 'https://static.prod-images.emergentagent.com/jobs/ce456438-b97a-4a6a-aa70-aab136e72d1b/images/5ef76335b71bf68581dd0a74141fd29a97909f764e61788554de80b839d907b6.png';
const ROGUE_IMG = 'https://static.prod-images.emergentagent.com/jobs/ce456438-b97a-4a6a-aa70-aab136e72d1b/images/98e85895129f1cdc43fbac30a406cec77cb7fcf8ce4e0a6f7bdde9dc5cff7cd4.png';

const Onboarding = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [characterClass, setCharacterClass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setError('Enter your hero name.'); return; }
    if (!characterClass) { setError('Choose your class.'); return; }
    onComplete(name.trim(), characterClass);
  };

  const CLASS_CARDS = [
    {
      id: 'warrior',
      label: 'WARRIOR',
      img: WARRIOR_IMG,
      bonus: '+20% XP on Strength Training',
      icon: <Swords size={14} className="text-[#FF4500]" />,
      desc: 'Master of brute force. Crushes iron and stone.',
    },
    {
      id: 'rogue',
      label: 'ROGUE',
      img: ROGUE_IMG,
      bonus: '+20% XP on Cardio',
      icon: <Wind size={14} className="text-[#FF4500]" />,
      desc: 'Swift as shadow. Endures where others fall.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-block border-2 border-[#FF4500] px-4 py-2 mb-4">
            <span className="font-pixel text-[10px] text-[#FF4500] tracking-wider">SEASON I</span>
          </div>
          <h1 className="font-pixel text-[#FF4500] text-2xl leading-tight mb-1">
            FITNESS
          </h1>
          <h1 className="font-pixel text-zinc-100 text-2xl leading-tight mb-4">
            QUEST
          </h1>
          <p className="font-plex text-zinc-400 text-sm leading-relaxed">
            Your real-world effort earns in-game power.<br />
            Train hard. Level up. Conquer.
          </p>
        </div>

        {/* Name Input */}
        <div className="mb-5">
          <label className="font-pixel text-[9px] text-zinc-400 uppercase tracking-wider block mb-2">
            Hero Name
          </label>
          <input
            data-testid="hero-name-input"
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter your name..."
            maxLength={20}
            className="bg-[#09090B] border-2 border-[#52525B] text-zinc-100 font-plex px-4 py-3 focus:outline-none focus:border-[#FF4500] placeholder-zinc-600 w-full transition-colors"
          />
        </div>

        {/* Class Selection */}
        <div className="mb-5">
          <label className="font-pixel text-[9px] text-zinc-400 uppercase tracking-wider block mb-3">
            Choose Your Class
          </label>
          <div className="grid grid-cols-2 gap-3">
            {CLASS_CARDS.map(cls => (
              <button
                key={cls.id}
                data-testid={`class-${cls.id}-btn`}
                onClick={() => { setCharacterClass(cls.id); setError(''); }}
                className={`bg-[#18181B] border-2 p-4 transition-all flex flex-col items-center gap-2 active:scale-95 ${
                  characterClass === cls.id
                    ? 'border-[#FF4500] shadow-[0_0_16px_rgba(255,69,0,0.35)]'
                    : 'border-[#3F3F46] hover:border-[#52525B]'
                }`}
              >
                <img src={cls.img} alt={cls.label} className="w-20 h-20 object-contain" />
                <div className="flex items-center gap-1">
                  {cls.icon}
                  <span className="font-pixel text-[10px] text-zinc-100">{cls.label}</span>
                </div>
                <p className="font-plex text-[10px] text-zinc-400 text-center leading-tight">{cls.desc}</p>
                <span className={`font-pixel text-[8px] text-center leading-tight ${characterClass === cls.id ? 'text-[#FF4500]' : 'text-zinc-500'}`}>
                  {cls.bonus}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p data-testid="onboarding-error" className="font-plex text-[#FF4500] text-sm mb-3">{error}</p>
        )}

        {/* Begin Button */}
        <button
          data-testid="begin-adventure-btn"
          onClick={handleSubmit}
          className="w-full bg-[#FF4500] hover:bg-[#DC2626] text-white font-pixel text-xs py-4 px-6 border-2 border-[#FF8C00] hover:border-[#FF4500] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.4),_4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[inset_-1px_-1px_0px_rgba(0,0,0,0.4),_1px_1px_0px_rgba(0,0,0,1)] transition-all uppercase"
        >
          Begin Adventure
        </button>
      </motion.div>
    </div>
  );
};

export default Onboarding;
