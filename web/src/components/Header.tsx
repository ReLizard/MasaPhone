import React from 'react';
import { Download, Upload, Info, Smartphone, BarChart3 } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: () => void;
  onInfo: () => void;
  activeTab: 'progressions' | 'balance';
  onTabChange: (tab: 'progressions' | 'balance') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExport,
  onImport,
  onInfo,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="bg-[#181818] border-b border-[#2a2a2a] sticky top-0 z-30 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand: Single Unified High-Res Logo Banner (Phone + Text Side-by-Side) */}
        <div className="flex items-center">
          <img
            src={`${import.meta.env.BASE_URL}masaphone_brand_hd.png`}
            alt="MasaPhone Money Management"
            className="h-10 sm:h-11 w-auto object-contain transition-transform hover:opacity-95"
          />
        </div>

        {/* Action Buttons - Clean and Compact */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={onImport}
            title="Importa Backup"
            className="p-2 text-gray-300 hover:text-sky-400 hover:bg-[#252525] rounded-xl transition-colors border border-transparent hover:border-[#333333]"
          >
            <Upload className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            onClick={onExport}
            title="Esporta Backup"
            className="p-2 text-gray-300 hover:text-sky-400 hover:bg-[#252525] rounded-xl transition-colors border border-transparent hover:border-[#333333]"
          >
            <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
          <button
            onClick={onInfo}
            title="Informazioni e Guida"
            className="p-2 text-gray-400 hover:text-sky-400 hover:bg-[#252525] rounded-xl transition-colors border border-transparent hover:border-[#333333]"
          >
            <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-4xl mx-auto px-4 flex border-t border-[#262626]">
        <button
          onClick={() => onTabChange('progressions')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'progressions'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#202020]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Progressioni</span>
        </button>
        <button
          onClick={() => onTabChange('balance')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'balance'
              ? 'border-sky-500 text-sky-400 bg-sky-500/5'
              : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-[#202020]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Bilancio Globale</span>
        </button>
      </div>
    </header>
  );
};
