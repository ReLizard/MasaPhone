import React, { useState, useEffect } from 'react';
import { SlotConfig, rebuildEngine, formatEuro, ResultType } from '../core/MasanielloEngine';
import { 
  Check, 
  X, 
  Undo2, 
  Trash2, 
  Settings, 
  Trophy, 
  AlertTriangle, 
  FileText,
  Coins
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProgressionViewProps {
  slot: SlotConfig;
  slotIndex: number;
  onUpdate: (updated: SlotConfig) => void;
  onOpenConfig: () => void;
  onReset: () => void;
}

export const ProgressionView: React.FC<ProgressionViewProps> = ({
  slot,
  slotIndex,
  onUpdate,
  onOpenConfig,
  onReset,
}) => {
  const engine = rebuildEngine(slot);
  const currentIndex = engine.currentIndex();
  const isFinished = engine.finished();
  const isWon = engine.isWon();

  // Next Bet local states
  const currentOddsVal = slot.odds[currentIndex] || "2.00";
  const [oddsInput, setOddsInput] = useState(currentOddsVal);
  const [customStakeInput, setCustomStakeInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  useEffect(() => {
    setOddsInput(slot.odds[currentIndex] || "2.00");
    setCustomStakeInput("");
    setNoteInput("");
  }, [currentIndex, slot]);

  // Trigger celebration on win
  useEffect(() => {
    if (isFinished && isWon) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    }
  }, [isFinished, isWon]);

  const recommendedStake = engine.currentStakeExact().toFixed(2);

  const handleOddsChange = (val: string) => {
    setOddsInput(val);
    const updatedOdds = [...slot.odds];
    if (parseFloat(val) > 1.0) {
      updatedOdds[currentIndex] = val;
      onUpdate({ ...slot, odds: updatedOdds });
    }
  };

  const handleRegisterResult = (result: ResultType) => {
    const updatedOdds = [...slot.odds];
    const actualOdds = parseFloat(oddsInput) > 1.0 ? oddsInput : (slot.odds[currentIndex] || "2.00");
    updatedOdds[currentIndex] = actualOdds;

    const actualStake = customStakeInput.trim() !== "" ? customStakeInput.trim() : null;

    const newResults = [...slot.results, result];
    const newStakes = [...slot.actualStakes, actualStake];
    const newNotes = [...slot.notes, noteInput.trim()];

    onUpdate({
      ...slot,
      odds: updatedOdds,
      results: newResults,
      actualStakes: newStakes,
      notes: newNotes,
    });
  };

  const handleUndoLast = () => {
    if (slot.results.length === 0) return;
    onUpdate({
      ...slot,
      results: slot.results.slice(0, -1),
      actualStakes: slot.actualStakes.slice(0, -1),
      notes: slot.notes.slice(0, -1),
    });
  };

  const remainingEvents = slot.totalEvents - currentIndex;
  const remainingWinsNeeded = Math.max(0, slot.targetWins - engine.wins());
  const maxLossesAllowed = slot.totalEvents - slot.targetWins;
  const currentLosses = engine.losses();

  return (
    <div className="space-y-4 pb-12">
      {/* Top Action Buttons */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onOpenConfig}
          className="flex-1 py-2 px-3 bg-[#222222] hover:bg-[#2a2a2a] text-sky-400 border border-[#333333] rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Configura / Riavvia</span>
        </button>
        <button
          onClick={() => setShowConfirmReset(true)}
          className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Azzera</span>
        </button>
      </div>

      {/* Main KPI Stats Card */}
      <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#282828] pb-3 mb-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span>{slot.name || `Masa ${slotIndex + 1}`}</span>
              <span className="text-xs font-mono font-normal text-gray-400">
                ({slot.targetWins}/{slot.totalEvents} attesi)
              </span>
            </h2>
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-mono">
              +{engine.potentialYieldPercent().toFixed(1)}% Resa
            </span>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
          <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2b2b2b]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Cassa Iniziale</div>
            <div className="text-sm font-bold text-gray-200 font-mono mt-0.5">
              {formatEuro(slot.initialBankroll)}
            </div>
          </div>
          <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2b2b2b]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Cassa Attuale</div>
            <div className="text-sm font-bold text-sky-400 font-mono mt-0.5">
              {formatEuro(engine.currentBankroll().toFixed(2))}
            </div>
          </div>
          <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2b2b2b]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Target Finale</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {formatEuro(engine.potentialFinalBankroll().toFixed(2))}
            </div>
          </div>
          <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2b2b2b]">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Utile Netto</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              +{formatEuro(engine.potentialNetProfit().toFixed(2))}
            </div>
          </div>
        </div>

        {/* Status Indicators Pill Bar */}
        <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-medium">
          <div className="flex items-center space-x-3 text-gray-300">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Vinti: <b>{engine.wins()}</b> / {slot.targetWins}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Persi: <b>{currentLosses}</b> / {maxLossesAllowed} max</span>
            </span>
          </div>
          <div className="text-gray-400 font-mono text-[11px]">
            Rimasti: <b>{remainingEvents}</b> ev.
          </div>
        </div>
      </div>

      {/* Finished Banner (Victory or Defeat) */}
      {isFinished ? (
        <div
          className={`p-5 rounded-2xl border text-center shadow-2xl animate-fade-in ${
            isWon
              ? 'bg-gradient-to-b from-emerald-950/40 to-emerald-900/20 border-emerald-500/40 text-emerald-300'
              : 'bg-gradient-to-b from-rose-950/40 to-rose-900/20 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="inline-flex p-3 rounded-2xl bg-white/5 mb-2">
            {isWon ? <Trophy className="w-8 h-8 text-emerald-400" /> : <AlertTriangle className="w-8 h-8 text-rose-400" />}
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            {isWon ? '🎉 OBIETTIVO RAGGIUNTO! PROGRESSIONE VINTA!' : '⚠️ PROGRESSIONE TERMINATA'}
          </h3>
          <p className="text-xs text-gray-300 max-w-sm mx-auto mb-4">
            {isWon
              ? `Hai raggiunto i ${slot.targetWins} eventi vinti! Cassa finale: ${formatEuro(engine.currentBankroll().toFixed(2))}`
              : `Superato il numero massimo di errori concessi (${maxLossesAllowed}). Cassa residua: ${formatEuro(engine.currentBankroll().toFixed(2))}`}
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={handleUndoLast}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-gray-300 text-xs font-semibold rounded-xl transition-colors flex items-center space-x-1.5"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Annulla Ultima</span>
            </button>
            <button
              onClick={onOpenConfig}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all"
            >
              Riavvia Nuova Cassa
            </button>
          </div>
        </div>
      ) : (
        /* Next Bet Action Card */
        <div className="bg-[#1e1e1e] border border-sky-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-emerald-400"></div>

          <div className="flex items-center justify-between mb-3 pt-1">
            <span className="text-xs font-bold text-sky-400 flex items-center space-x-1.5">
              <Coins className="w-4 h-4" />
              <span>PROSSIMA GIOCATA • Evento #{currentIndex + 1} di {slot.totalEvents}</span>
            </span>
            <span className="text-[11px] text-gray-400">
              Mancano {remainingWinsNeeded} vinte
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {/* Odds Input */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                Quota Evento #{currentIndex + 1}
              </label>
              <input
                type="number"
                step="0.01"
                min="1.01"
                value={oddsInput}
                onChange={(e) => handleOddsChange(e.target.value)}
                className="w-full bg-[#141414] border border-[#383838] rounded-xl px-3.5 py-2.5 text-base font-bold text-white font-mono focus:outline-none focus:border-sky-500 transition-colors"
                placeholder="2.00"
              />
            </div>

            {/* Recommended & Custom Stake */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-gray-300">
                  Puntata Consigliata
                </label>
                <span className="text-[10px] text-gray-400">
                  (puoi personalizzarla)
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={customStakeInput}
                  onChange={(e) => setCustomStakeInput(e.target.value)}
                  placeholder={`${recommendedStake} €`}
                  className="w-full bg-[#141414] border border-[#383838] rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 font-mono placeholder:text-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Optional Note */}
          <div className="mb-4">
            <input
              type="text"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="Nota / Partita (es. Real Madrid - Barcellona Over 2.5)"
              className="w-full bg-[#141414] border border-[#303030] rounded-xl px-3 py-2 text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* WIN / LOSS Large Touch Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleRegisterResult('WIN')}
              className="py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span className="text-sm">VINTO (WIN)</span>
            </button>

            <button
              onClick={() => handleRegisterResult('LOSS')}
              className="py-3.5 px-4 bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <X className="w-5 h-5 stroke-[3]" />
              <span className="text-sm">PERSO (LOSS)</span>
            </button>
          </div>
        </div>
      )}

      {/* Events History Table */}
      <div className="bg-[#1a1a1a] border border-[#2d2d2d] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 border-b border-[#282828] flex items-center justify-between bg-[#202020]">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Storico Giocate ({engine.history().length})</span>
          </h3>

          {slot.results.length > 0 && !isFinished && (
            <button
              onClick={handleUndoLast}
              className="text-[11px] text-gray-400 hover:text-sky-400 flex items-center space-x-1 transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Annulla Ultima</span>
            </button>
          )}
        </div>

        {engine.history().length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500">
            Nessuna giocata registrata finora. Inserisci quota ed esito per iniziare.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161616] text-gray-400 font-semibold border-b border-[#262626]">
                <tr>
                  <th className="px-3.5 py-2.5">#</th>
                  <th className="px-3.5 py-2.5">Quota</th>
                  <th className="px-3.5 py-2.5 text-center">Esito</th>
                  <th className="px-3.5 py-2.5 text-right">Puntata</th>
                  <th className="px-3.5 py-2.5 text-right">Cassa Dopo</th>
                  <th className="px-3.5 py-2.5">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424] font-mono">
                {engine.history().map((ev) => (
                  <tr key={ev.number} className="hover:bg-[#222222] transition-colors">
                    <td className="px-3.5 py-2.5 text-gray-400 font-bold">{ev.number}</td>
                    <td className="px-3.5 py-2.5 text-gray-200">{ev.odds}</td>
                    <td className="px-3.5 py-2.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          ev.result === 'WIN'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {ev.result}
                      </span>
                    </td>
                    <td className="px-3.5 py-2.5 text-right text-gray-200">{formatEuro(ev.actualStake)}</td>
                    <td className="px-3.5 py-2.5 text-right font-bold text-sky-300">
                      {formatEuro(ev.bankrollAfter)}
                    </td>
                    <td className="px-3.5 py-2.5 text-gray-400 font-sans truncate max-w-[150px]">
                      {ev.note || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#1e1e1e] border border-rose-500/30 rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Azzera Progression?</h3>
            <p className="text-xs text-gray-400 mb-4">
              Tutti i dati e lo storico delle giocate di questo slot verranno cancellati.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 bg-[#2a2a2a] text-xs font-semibold text-gray-300 rounded-xl hover:bg-[#333333] transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
                className="flex-1 py-2 bg-rose-600 text-xs font-bold text-white rounded-xl hover:bg-rose-500 transition-colors shadow-lg shadow-rose-900/30"
              >
                Sì, Azzera
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
