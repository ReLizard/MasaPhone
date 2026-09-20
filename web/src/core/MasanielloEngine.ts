import { Decimal } from 'decimal.js';

// Configure Decimal.js with 30 decimal places precision, HALF_UP rounding
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export type ResultType = 'WIN' | 'LOSS';

export interface EventItem {
  number: number;
  odds: string;             // Stored as decimal string e.g. "2.00"
  result: ResultType;
  recommendedStake: string;
  actualStake: string;
  bankrollAfter: string;
  note: string;
}

export interface SlotConfig {
  name: string;
  isConfigured: boolean;
  initialBankroll: string;  // e.g. "35.00"
  totalEvents: number;      // e.g. 10
  targetWins: number;       // e.g. 7
  odds: string[];           // length 100 default odds
  results: ResultType[];
  actualStakes: (string | null)[];
  notes: string[];
}

export function defaultOdds(q = "2.00"): string[] {
  return Array.from({ length: 100 }, () => q);
}

export function createEmptySlot(index: number): SlotConfig {
  return {
    name: `Masa ${index + 1}`,
    isConfigured: false,
    initialBankroll: "35.00",
    totalEvents: 10,
    targetWins: 7,
    odds: defaultOdds("2.00"),
    results: [],
    actualStakes: [],
    notes: [],
  };
}

export class MasanielloEngine {
  public readonly initialBankroll: Decimal;
  public readonly totalEvents: number;
  public readonly targetWins: number;
  private odds: Decimal[];
  private results: ResultType[] = [];
  private events: EventItem[] = [];
  private bankroll: Decimal;
  private memo: Map<string, Decimal> = new Map();

  constructor(
    initialBankroll: string | Decimal,
    totalEvents: number,
    targetWins: number,
    odds: (string | Decimal)[]
  ) {
    this.initialBankroll = new Decimal(initialBankroll || 0);
    this.totalEvents = totalEvents;
    this.targetWins = targetWins;
    this.odds = odds.map(q => new Decimal(q || 2.0));
    this.bankroll = this.initialBankroll;
  }

  public wins(): number {
    return this.results.filter(r => r === 'WIN').length;
  }

  public losses(): number {
    return this.results.filter(r => r === 'LOSS').length;
  }

  public currentIndex(): number {
    return this.results.length;
  }

  public currentBankroll(): Decimal {
    return this.bankroll;
  }

  public history(): EventItem[] {
    return [...this.events];
  }

  public currentOdds(): Decimal {
    const idx = this.currentIndex();
    return idx < this.odds.length ? this.odds[idx] : new Decimal(2.0);
  }

  public oddsSnapshot(): Decimal[] {
    return [...this.odds];
  }

  public updateCurrentOdds(q: string | Decimal): void {
    const decQ = new Decimal(q);
    if (decQ.lte(1)) {
      throw new Error("La quota deve essere maggiore di 1.00");
    }
    const idx = this.currentIndex();
    if (idx < this.odds.length) {
      this.odds[idx] = decQ;
      this.memo.clear();
    }
  }

  public finished(): boolean {
    return (
      this.results.length >= this.totalEvents ||
      this.wins() >= this.targetWins ||
      this.losses() > (this.totalEvents - this.targetWins)
    );
  }

  public isWon(): boolean {
    return this.wins() >= this.targetWins;
  }

  public isLost(): boolean {
    return this.losses() > (this.totalEvents - this.targetWins);
  }

  public value(index: number, requiredWins: number): Decimal {
    const remaining = this.totalEvents - index;
    if (requiredWins <= 0) return new Decimal(1);
    if (requiredWins > remaining) return new Decimal(0);

    const key = `${index}_${requiredWins}`;
    if (this.memo.has(key)) {
      return this.memo.get(key)!;
    }

    if (requiredWins === remaining) {
      let p = new Decimal(1);
      for (let i = index; i < this.totalEvents; i++) {
        const q = i < this.odds.length ? this.odds[i] : new Decimal(2.0);
        p = p.times(q);
      }
      this.memo.set(key, p);
      return p;
    }

    const q = index < this.odds.length ? this.odds[index] : new Decimal(2.0);
    const lossState = this.value(index + 1, requiredWins);
    const winState = this.value(index + 1, requiredWins - 1);
    const den = lossState.plus(q.minus(1).times(winState));

    let result = new Decimal(0);
    if (!den.isZero()) {
      result = q.times(lossState).times(winState).dividedBy(den);
    }

    this.memo.set(key, result);
    return result;
  }

  public potentialFinalBankroll(): Decimal {
    const mult = this.value(0, this.targetWins);
    return this.initialBankroll.times(mult);
  }

  public potentialNetProfit(): Decimal {
    return this.potentialFinalBankroll().minus(this.initialBankroll);
  }

  public potentialYieldPercent(): Decimal {
    if (this.initialBankroll.isZero()) return new Decimal(0);
    return this.potentialNetProfit().dividedBy(this.initialBankroll).times(100);
  }

  public currentStakeExact(): Decimal {
    if (this.finished()) return new Decimal(0);

    const index = this.currentIndex();
    const requiredWins = this.targetWins - this.wins();
    if (requiredWins <= 0 || requiredWins > (this.totalEvents - index)) {
      return new Decimal(0);
    }

    const q = this.currentOdds();
    const lossState = this.value(index + 1, requiredWins);
    const winState = this.value(index + 1, requiredWins - 1);
    const den = lossState.plus(q.minus(1).times(winState));

    if (den.isZero()) return new Decimal(0);

    const pWin = q.times(winState).dividedBy(den);
    const factor = new Decimal(1).minus(pWin);
    if (factor.lte(0)) return new Decimal(0);

    return this.bankroll.times(factor);
  }

  public register(result: ResultType, actualStakeStr?: string | null, note = ""): void {
    if (this.finished()) {
      throw new Error("Progressione già terminata.");
    }

    const recommended = this.currentStakeExact();
    const stake = actualStakeStr && actualStakeStr.trim() !== ""
      ? new Decimal(actualStakeStr)
      : recommended;

    if (stake.lt(0)) {
      throw new Error("La giocata non può essere negativa.");
    }

    const q = this.currentOdds();
    if (result === 'WIN') {
      this.bankroll = this.bankroll.plus(stake.times(q.minus(1)));
    } else {
      this.bankroll = this.bankroll.minus(stake);
    }

    this.results.push(result);
    this.memo.clear();

    this.events.push({
      number: this.results.length,
      odds: q.toFixed(2),
      result,
      recommendedStake: recommended.toFixed(2),
      actualStake: stake.toFixed(2),
      bankrollAfter: this.bankroll.toFixed(2),
      note,
    });
  }
}

export function rebuildEngine(slot: SlotConfig): MasanielloEngine {
  const engine = new MasanielloEngine(
    slot.initialBankroll,
    slot.totalEvents,
    slot.targetWins,
    slot.odds
  );

  slot.results.forEach((r, idx) => {
    if (!engine.finished()) {
      if (idx < slot.odds.length) {
        engine.updateCurrentOdds(slot.odds[idx]);
      }
      const actualStake = slot.actualStakes[idx] ?? null;
      const note = slot.notes[idx] ?? "";
      engine.register(r, actualStake, note);
    }
  });

  return engine;
}

export function formatEuro(val: string | number | Decimal): string {
  const dec = new Decimal(val || 0);
  return `${dec.toFixed(2)} €`;
}
