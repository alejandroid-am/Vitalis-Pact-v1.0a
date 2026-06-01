import React from 'react';
import { Tent, Shield, Map } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'camp', label: 'CAMP', Icon: Tent },
  { id: 'hero', label: 'HERO', Icon: Shield },
  { id: 'exploration', label: 'EXPLORE', Icon: Map },
];

const BottomNav = ({ screen, onNavigate }) => (
  <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 bg-[#18181B] border-t-2 border-[#3F3F46] flex justify-around items-stretch h-16 z-50">
    {NAV_ITEMS.map(({ id, label, Icon }) => {
      const active = screen === id;
      return (
        <button
          key={id}
          data-testid={`nav-${id}`}
          onClick={() => onNavigate(id)}
          className={`flex flex-col items-center justify-center gap-1 flex-1 transition-all border-t-2 ${
            active
              ? 'text-[#FF4500] border-[#FF4500] bg-[#27272A]'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Icon size={18} />
          <span className="font-pixel text-[7px]">{label}</span>
        </button>
      );
    })}
  </nav>
);

export default BottomNav;
