import React from 'react';
import { SlotConfig, rebuildEngine, formatEuro } from '../core/MasanielloEngine';
import { Decimal } from 'decimal.js';
import { Wallet, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface BalanceViewProps {
  slots: SlotConfig[];
  onSelectSlot: (index: number) => void;
}

export const BalanceView: React.FC<BalanceViewProps> = ({
  slots,
  onSelectSlot,
}) => {
  const configuredSlots = slots.filter((s) => s.isConfigured);

  let totalInitial = new Decimal(0);
  let totalCurrent = new Decimal(0);
  let totalPotentialFinal = new Decimal(0);

  const slotSummaries = slots.map((slot, index) => {
    if (!slot.isConfigured) return null;
    const engine = rebuildEngine(slot);
    const initial = new Decimal(slot.initialBankroll);
    const current = engine.currentBankroll();
    const potentialFinal = engine.potentialFinalBankroll();
    const profit = current.minus(initial);

    totalInitial = totalInitial.plus(initial);
    totalCurrent = totalCurrent.plus(current);
    totalPotentialFinal = totalPotentialFinal.plus(potentialFinal);

    return {
      index,
      name: slot.name || `Masa ${index + 1}`,
      initial,
      current,
      profit,
      potentialFinal,
      wins: engine.wins(),
      targetWins: slot.targetWins,
      losses: engine.losses(),
      totalEvents: slot.totalEvents,
      finished: engine.finished(),
      won: engine.isWon(),
      lost: engine.isLost(),
      playedCount: slot.results.length,
    };
  });

  const totalNetProfit = totalCurrent.minus(totalInitial);
  const totalYieldPct = !totalInitial.isZero()
    ? totalNetProfit.dividedBy(totalInitial).times(100)
    : new Decimal(0);

  return (
    <div className="space-y-4 pb-12 animate-fade-in">
      {/* Global Summary Card */}
      <div className="bg-gradient-to-br from-[#1a222e] to-[#141b24] border border-sky-500/30 rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Bilancio Multi-Masaniello</h2>
              <p className="text-xs text-gray-400">
                {configuredSlots.length} su 6 progressioni attive
              </p>
            </div>
          </div>
          <div className="text-right">
            <span
              className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${
                totalNetProfit.gte(0)
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {totalNetProfit.gte(0) ? '+' : ''}
              {totalYieldPct.toFixed(1)}% Totale
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="bg-[#121820]/70 p-3 rounded-xl border border-sky-500/10">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Capitale Investito</div>
            <div className="text-sm sm:text-base font-bold text-gray-200 font-mono mt-0.5">
              {formatEuro(totalInitial.toFixed(2))}
            </div>
          </div>
          <div className="bg-[#121820]/70 p-3 rounded-xl border border-sky-500/10">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Cassa Complessiva</div>
            <div className="text-sm sm:text-base font-bold text-sky-400 font-mono mt-0.5">
              {formatEuro(totalCurrent.toFixed(2))}
            </div>
          </div>
          <div className="bg-[#121820]/70 p-3 rounded-xl border border-sky-500/10">
            <div className="text-[10px] uppercase font-semibold text-gray-400">Profitto Netto</div>
            <div
              className={`text-sm sm:text-base font-bold font-mono mt-0.5 ${
                totalNetProfit.gte(0) ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {totalNetProfit.gte(0) ? '+' : ''}
              {formatEuro(totalNetProfit.toFixed(2))}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Slots List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-1">
          Dettaglio Casse Singole
        </h3>

        {slots.map((slot, index) => {
          const summary = slotSummaries[index];

          if (!slot.isConfigured || !summary) {
            return (
              <div
                key={index}
                onClick={() => onSelectSlot(index)}
                className="p-3.5 bg-[#181818] border border-[#262626] rounded-xl flex items-center justify-between text-xs text-gray-500 hover:border-[#3a3a3a] cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-400">{slot.name || `Masa ${index + 1}`}</span>
                  <span className="text-[11px] opacity-60">(Non configurato)</span>
                </div>
                <span className="text-sky-400 text-xs font-semibold flex items-center space-x-1">
                  <span>Configura</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              onClick={() => onSelectSlot(index)}
              className="p-4 bg-[#1e1e1e] hover:bg-[#232323] border border-[#2d2d2d] hover:border-sky-500/40 rounded-xl cursor-pointer transition-all shadow-md group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm group-hover:text-sky-400 transition-colors">
                    {summary.name}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    ({summary.wins}/{summary.targetWins} vinti su {summary.totalEvents})
                  </span>
                </div>

                <div>
                  {summary.finished ? (
                    summary.won ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Vinta</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Persa</span>
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      <span>In corso ({summary.playedCount} ev.)</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-2 border-t border-[#2a2a2a]">
                <div>
                  <span className="text-[10px] text-gray-400 block font-sans">Iniziale</span>
                  <span className="text-gray-200 font-semibold">{formatEuro(summary.initial.toFixed(2))}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-sans">Attuale</span>
                  <span className="text-sky-400 font-bold">{formatEuro(summary.current.toFixed(2))}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-sans">Profitto</span>
                  <span
                    className={`font-bold ${
                      summary.profit.gte(0) ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {summary.profit.gte(0) ? '+' : ''}
                    {formatEuro(summary.profit.toFixed(2))}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
