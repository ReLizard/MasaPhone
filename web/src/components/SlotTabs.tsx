import React from 'react';
import { SlotConfig, rebuildEngine } from '../core/MasanielloEngine';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SlotTabsProps {
  slots: SlotConfig[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const SlotTabs: React.FC<SlotTabsProps> = ({
  slots,
  selectedIndex,
  onSelect,
}) => {
  return (
    <div className="bg-[#161616] border-b border-[#262626] overflow-x-auto no-scrollbar py-2 px-3">
      <div className="max-w-4xl mx-auto flex space-x-2">
        {slots.map((slot, index) => {
          const isSelected = selectedIndex === index;
          let statusBadge = null;

          if (slot.isConfigured) {
            const engine = rebuildEngine(slot);
            if (engine.finished()) {
              if (engine.isWon()) {
                statusBadge = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
              } else {
                statusBadge = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
              }
            } else if (slot.results.length > 0) {
              statusBadge = (
                <span className="text-[10px] font-mono font-bold bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded">
                  {engine.wins()}/{slot.targetWins}
                </span>
              );
            }
          }

          return (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : slot.isConfigured
                  ? 'bg-[#222222] text-gray-300 hover:bg-[#2a2a2a] border border-[#333333]'
                  : 'bg-[#1a1a1a] text-gray-500 hover:text-gray-400 border border-[#262626]'
              }`}
            >
              <span>{slot.name || `Masa ${index + 1}`}</span>
              {!slot.isConfigured && (
                <span className="text-[10px] opacity-60 font-normal">(vuoto)</span>
              )}
              {statusBadge}
            </button>
          );
        })}
      </div>
    </div>
  );
};
