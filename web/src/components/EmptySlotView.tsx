import React from 'react';
import { PlusCircle, Calculator } from 'lucide-react';

interface EmptySlotViewProps {
  slotIndex: number;
  onConfigureClick: () => void;
}

export const EmptySlotView: React.FC<EmptySlotViewProps> = ({
  slotIndex,
  onConfigureClick,
}) => {
  return (
    <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-8 text-center shadow-xl my-4 flex flex-col items-center justify-center min-h-[320px]">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 border border-sky-500/20 shadow-lg shadow-sky-500/5">
        <Calculator className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-1.5">
        Slot Masa {slotIndex + 1} Vuoto
      </h3>

      <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
        Configura la cassa iniziale, il numero di eventi e gli eventi attesi per iniziare questa progressione.
      </p>

      <button
        onClick={onConfigureClick}
        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-500/25 transition-all flex items-center space-x-2 active:scale-95"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Configura Nuova Cassa</span>
      </button>
    </div>
  );
};
