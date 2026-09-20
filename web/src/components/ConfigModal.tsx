import React, { useState, useEffect } from 'react';
import { SlotConfig, MasanielloEngine, formatEuro } from '../core/MasanielloEngine';
import { X, Calculator, Settings, AlertCircle, ArrowRight } from 'lucide-react';
import { Decimal } from 'decimal.js';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  slot: SlotConfig;
  slotIndex: number;
  onSave: (updatedSlot: SlotConfig) => void;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({
  isOpen,
  onClose,
  slot,
  slotIndex,
  onSave,
}) => {
  const [name, setName] = useState(slot.name || `Masa ${slotIndex + 1}`);
  const [bankroll, setBankroll] = useState(slot.initialBankroll || "35.00");
  const [totalEvents, setTotalEvents] = useState(slot.totalEvents || 10);
  const [targetWins, setTargetWins] = useState(slot.targetWins || 7);
  const [defaultOdd, setDefaultOdd] = useState(slot.odds[0] || "2.00");
  const [oddsMode] = useState<'uniform' | 'custom'>('uniform');
  const [customOdds, setCustomOdds] = useState<string[]>([...slot.odds]);

  useEffect(() => {
    setName(slot.name || `Masa ${slotIndex + 1}`);
    setBankroll(slot.initialBankroll || "35.00");
    setTotalEvents(slot.totalEvents || 10);
    setTargetWins(slot.targetWins || 7);
    setDefaultOdd(slot.odds[0] || "2.00");
    setCustomOdds([...slot.odds]);
  }, [slot, slotIndex, isOpen]);

  if (!isOpen) return null;

  // Real-time calculation preview
  let preview = {
    finalBankroll: '0.00',
    netProfit: '0.00',
    yieldPct: '0.00',
    firstStake: '0.00',
    isValid: false,
    errorMessage: '',
  };

  try {
    const numBankroll = parseFloat(bankroll);
    if (isNaN(numBankroll) || numBankroll <= 0) {
      preview.errorMessage = 'Inserisci una cassa iniziale valida (> 0)';
    } else if (targetWins <= 0 || targetWins > totalEvents) {
      preview.errorMessage = 'Eventi attesi deve essere compreso tra 1 e Eventi Totali';
    } else if (totalEvents < 1 || totalEvents > 100) {
      preview.errorMessage = 'Eventi totali deve essere tra 1 e 100';
    } else {
      const oddsList = oddsMode === 'uniform' 
        ? Array(totalEvents).fill(defaultOdd) 
        : customOdds.slice(0, totalEvents).map(q => q || defaultOdd);

      const engine = new MasanielloEngine(bankroll, totalEvents, targetWins, oddsList);
      preview.finalBankroll = engine.potentialFinalBankroll().toFixed(2);
      preview.netProfit = engine.potentialNetProfit().toFixed(2);
      preview.yieldPct = engine.potentialYieldPercent().toFixed(2);
      preview.firstStake = engine.currentStakeExact().toFixed(2);
      preview.isValid = true;
    }
  } catch (err: any) {
    preview.errorMessage = err?.message || 'Errore nei parametri';
    preview.isValid = false;
  }

  const handleApplyDefaultOdd = (val: string) => {
    setDefaultOdd(val);
    const updated = Array(100).fill(val);
    setCustomOdds(updated);
  };

  const handleSave = () => {
    if (!preview.isValid) return;

    const finalOdds = oddsMode === 'uniform'
      ? Array(100).fill(defaultOdd)
      : Array.from({ length: 100 }, (_, i) => customOdds[i] || defaultOdd);

    const updated: SlotConfig = {
      ...slot,
      name: name.trim() || `Masa ${slotIndex + 1}`,
      isConfigured: true,
      initialBankroll: new Decimal(bankroll).toFixed(2),
      totalEvents,
      targetWins,
      odds: finalOdds,
      results: [],
      actualStakes: [],
      notes: [],
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1c1c] border border-[#333333] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b2b2b] bg-[#222222]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Configura Masaniello</h2>
              <p className="text-xs text-gray-400">Slot {slotIndex + 1}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2e2e2e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Slot Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Nome Progression (opzionale)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Masa ${slotIndex + 1}`}
              className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Initial Bankroll */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Cassa Iniziale (€)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-gray-400 text-sm">€</span>
              <input
                type="number"
                step="0.01"
                min="1"
                value={bankroll}
                onChange={(e) => setBankroll(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Events Count and Target Wins */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Eventi Totali (N)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={totalEvents}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setTotalEvents(val);
                  if (targetWins > val) setTargetWins(val);
                }}
                className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Eventi Attesi (Vinti - K)
              </label>
              <input
                type="number"
                min="1"
                max={totalEvents}
                value={targetWins}
                onChange={(e) => setTargetWins(parseInt(e.target.value) || 1)}
                className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Odds Configuration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-300">
                Quota Media / Predefinita
              </label>
              <div className="flex space-x-1 text-[11px]">
                {['1.50', '1.80', '2.00', '2.20'].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleApplyDefaultOdd(q)}
                    className={`px-2 py-0.5 rounded-md font-mono ${
                      defaultOdd === q
                        ? 'bg-sky-500 text-white'
                        : 'bg-[#2a2a2a] text-gray-400 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              step="0.01"
              min="1.01"
              value={defaultOdd}
              onChange={(e) => handleApplyDefaultOdd(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Real-time Math Preview Card */}
          {preview.isValid ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#182635] to-[#121d28] border border-sky-500/30 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Proiezione Resa Masaniello</span>
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  +{preview.yieldPct}% Resa
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-sky-500/20">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-medium">1ª Puntata</div>
                  <div className="text-sm font-bold text-white font-mono">{formatEuro(preview.firstStake)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-medium">Cassa Finale</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono">{formatEuro(preview.finalBankroll)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-medium">Utile Netto</div>
                  <div className="text-sm font-bold text-sky-300 font-mono">+{formatEuro(preview.netProfit)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{preview.errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#2b2b2b] bg-[#202020] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-[#2a2a2a] rounded-xl transition-colors"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={!preview.isValid}
            className="px-5 py-2.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center space-x-1.5"
          >
            <span>Avvia Progression</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
