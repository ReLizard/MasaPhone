package it.masaniello

import java.math.BigDecimal
import java.math.RoundingMode

enum class Result { WIN, LOSS }

data class Event(
    val number: Int,
    val odds: BigDecimal,
    val result: Result,
    val recommendedStake: BigDecimal,
    val actualStake: BigDecimal,
    val bankrollAfter: BigDecimal,
    val note: String = ""
)

class MasanielloEngine(
    val initialBankroll: BigDecimal,
    val totalEvents: Int,
    val targetWins: Int,
    odds: List<BigDecimal>
) {
    private val odds = odds.toMutableList()
    private val results = mutableListOf<Result>()
    private val events = mutableListOf<Event>()
    private var bankroll = initialBankroll
    private val memo = mutableMapOf<Pair<Int, Int>, BigDecimal>()

    fun wins() = results.count { it == Result.WIN }
    fun losses() = results.count { it == Result.LOSS }
    fun currentIndex() = results.size
    fun currentBankroll() = bankroll
    fun history() = events.toList()
    fun currentOdds() = if (currentIndex() < odds.size) odds[currentIndex()] else BigDecimal("2.00")
    fun oddsSnapshot() = odds.toList()

    fun updateCurrentOdds(q: BigDecimal) {
        require(q > BigDecimal.ONE) { "La quota deve essere maggiore di 1." }
        if (currentIndex() < odds.size) {
            odds[currentIndex()] = q
            memo.clear()
        }
    }

    fun finished() =
        results.size >= totalEvents ||
        wins() >= targetWins ||
        losses() > (totalEvents - targetWins)

    fun value(index: Int, requiredWins: Int): BigDecimal {
        val remaining = totalEvents - index
        if (requiredWins <= 0) return BigDecimal.ONE
        if (requiredWins > remaining) return BigDecimal.ZERO

        val key = Pair(index, requiredWins)
        memo[key]?.let { return it }

        if (requiredWins == remaining) {
            var p = BigDecimal.ONE
            for (i in index until totalEvents) {
                p = p.multiply(if (i < odds.size) odds[i] else BigDecimal("2.00"))
            }
            memo[key] = p
            return p
        }

        val q = if (index < odds.size) odds[index] else BigDecimal("2.00")
        val lossState = value(index + 1, requiredWins)
        val winState = value(index + 1, requiredWins - 1)
        val den = lossState.add(q.subtract(BigDecimal.ONE).multiply(winState))

        val result = if (den.signum() == 0) {
            BigDecimal.ZERO
        } else {
            q.multiply(lossState).multiply(winState).divide(den, 30, RoundingMode.HALF_UP)
        }

        memo[key] = result
        return result
    }

    fun potentialFinalBankroll(): BigDecimal {
        val mult = value(0, targetWins)
        return initialBankroll.multiply(mult)
    }

    fun potentialNetProfit(): BigDecimal {
        return potentialFinalBankroll().subtract(initialBankroll)
    }

    fun currentStakeExact(): BigDecimal {
        if (finished()) return BigDecimal.ZERO

        val index = currentIndex()
        val requiredWins = targetWins - wins()
        if (requiredWins <= 0 || requiredWins > (totalEvents - index)) return BigDecimal.ZERO

        val q = currentOdds()
        val lossState = value(index + 1, requiredWins)
        val winState = value(index + 1, requiredWins - 1)
        val den = lossState.add(q.subtract(BigDecimal.ONE).multiply(winState))

        if (den.signum() == 0) return BigDecimal.ZERO

        val pWin = q.multiply(winState).divide(den, 30, RoundingMode.HALF_UP)
        val factor = BigDecimal.ONE.subtract(pWin)
        if (factor <= BigDecimal.ZERO) return BigDecimal.ZERO

        return bankroll.multiply(factor)
    }

    fun register(result: Result, actualStake: BigDecimal? = null, note: String = "") {
        check(!finished()) { "Progressione terminata." }

        val recommended = currentStakeExact()
        val stake = actualStake ?: recommended
        require(stake >= BigDecimal.ZERO) { "La giocata non può essere negativa." }

        val q = currentOdds()
        bankroll = if (result == Result.WIN) {
            bankroll.add(stake.multiply(q.subtract(BigDecimal.ONE)))
        } else {
            bankroll.subtract(stake)
        }

        results += result
        memo.clear()
        events += Event(
            number = results.size,
            odds = q,
            result = result,
            recommendedStake = recommended,
            actualStake = stake,
            bankrollAfter = bankroll,
            note = note
        )
    }
}
