import React from 'react';
import { Tent, Shield, Map, Store } from 'lucide-react';
import { sfx } from '../utils/sounds';

const NAV_ITEMS = [
  { id: 'camp',        label: 'CAMP',    Icon: Tent  },
  { id: 'hero',        label: 'HERO',    Icon: Shield },
  { id: '__workout__', label: 'TRAIN',   Icon: null   }, // FAB slot
  { id: 'market',      label: 'MARKET',  Icon: Store  },
  { id: 'exploration', label: 'EXPLORE', Icon: Map    },
];

const BottomNav = ({ screen, onNavigate, onOpenWorkout, hasUnread }) => (
  <nav
    className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-[10000]"
    style={{
      background: 'linear-gradient(180deg, rgba(6,6,8,0) 0%, #0a0a0e 14px)',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}
  >
    {/* Top border pixel line */}
    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#FF4500]/40 to-transparent" />

    <div
      className="flex justify-around items-end pb-1 pt-1"
      style={{ background: 'rgba(10,10,14,0.96)', backdropFilter: 'blur(12px)' }}
    >
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        // ─── FAB (center button) ───────────────────────────
        if (id === '__workout__') {
          return (
            <div key="fab" className="flex flex-col items-center justify-end pb-1" style={{ flex: '0 0 72px' }}>
              {/* Lift the FAB above the bar */}
              <div className="relative -mt-5">
                <button
                  data-testid="log-workout-btn"
                  onClick={() => { sfx.click(); onOpenWorkout(); }}
                  className="fab-ring relative w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90"
                  style={{
                    background: 'linear-gradient(145deg, #FF6B35, #FF4500, #DC2626)',
                    boxShadow: '0 0 0 3px rgba(255,69,0,0.2), 0 4px 16px rgba(255,69,0,0.45)',
                    border: '2px solid rgba(255,140,0,0.6)',
                  }}
                  aria-label="Log Workout"
                >
                  {/* Plus icon in pixel style */}
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <rect x="9" y="2" width="4" height="18" rx="1" fill="white"/>
                    <rect x="2" y="9" width="18" height="4" rx="1" fill="white"/>
                  </svg>
                </button>
              </div>
              <span
                className="font-pixel mt-1"
                style={{ fontSize: '6px', color: '#FF4500', letterSpacing: '0.05em' }}
              >
                {label}
              </span>
            </div>
          );
        }

        // ─── Regular tab ──────────────────────────────────
        const active = screen === id;
        return (
          <button
            key={id}
            data-testid={`nav-${id}`}
            onClick={() => { sfx.click(); onNavigate(id); }}
            className="flex flex-col items-center justify-end pb-1 gap-1 flex-1 transition-all relative"
            style={{ minHeight: 48 }}
          >
            {/* Active indicator bar */}
            {active && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-6 rounded-full"
                style={{ background: '#FF4500' }}
              />
            )}

            {/* Notification dot */}
            {id === 'exploration' && hasUnread && (
              <div
                className="absolute top-1 right-3 w-2 h-2 rounded-full bg-[#FF4500] notif-dot"
              />
            )}

            <Icon
              size={18}
              style={{
                color: active ? '#FF4500' : '#52525B',
                transition: 'color 0.15s, transform 0.15s',
                transform: active ? 'scale(1.1)' : 'scale(1)',
              }}
            />
            <span
              className="font-pixel"
              style={{
                fontSize: '6px',
                color: active ? '#FF4500' : '#52525B',
                letterSpacing: '0.05em',
                transition: 'color 0.15s',
              }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default BottomNav;
