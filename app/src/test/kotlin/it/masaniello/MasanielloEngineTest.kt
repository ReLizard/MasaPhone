package it.masaniello

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.math.BigDecimal
import java.math.RoundingMode

class MasanielloEngineTest {
    @Test fun firstStakeBaseCase() {
        val e = MasanielloEngine(BigDecimal("35.00"), 10, 7, List(10) { BigDecimal("2.00") })
        assertEquals("16.70", e.currentStakeExact().setScale(2, RoundingMode.HALF_UP).toPlainString())
    }

    @Test fun actualStakeIsStoredSeparatelyFromRecommendation() {
        val e = MasanielloEngine(BigDecimal("35.00"), 10, 7, List(10) { BigDecimal("2.00") })
        val recommended = e.currentStakeExact()
        val actual = BigDecimal("16.70")
        e.register(Result.WIN, actual)
        assertEquals(actual, e.history().first().actualStake)
        assertEquals(recommended, e.history().first().recommendedStake)
    }

    @Test fun historicalQuoteIsFrozenInEvent() {
        val odds = List(10) { BigDecimal("2.00") }
        val e = MasanielloEngine(BigDecimal("35.00"), 10, 7, odds)
        e.updateCurrentOdds(BigDecimal("1.97"))
        e.register(Result.WIN)
        e.updateCurrentOdds(BigDecimal("1.80"))
        assertTrue(BigDecimal("1.97").compareTo(e.history().first().odds) == 0)
        assertTrue(BigDecimal("1.80").compareTo(e.currentOdds()) == 0)
    }

    @Test fun bankrollUsesActualStake() {
        val e = MasanielloEngine(BigDecimal("35.00"), 10, 7, List(10) { BigDecimal("2.00") })
        e.register(Result.WIN, BigDecimal("10.00"))
        assertEquals("45.00", e.currentBankroll().setScale(2, RoundingMode.HALF_UP).toPlainString())
        e.register(Result.LOSS, BigDecimal("5.00"))
        assertEquals("40.00", e.currentBankroll().setScale(2, RoundingMode.HALF_UP).toPlainString())
    }

    @Test fun mixedQuotesWork() {
        val odds = List(10) { i -> when (i) { 4 -> BigDecimal("1.97"); 5 -> BigDecimal("1.80"); else -> BigDecimal("2.00") } }
        val e = MasanielloEngine(BigDecimal("35.00"), 10, 7, odds)
        repeat(4) { e.register(Result.WIN) }
        assertTrue(BigDecimal("1.97").compareTo(e.currentOdds()) == 0)
        assertTrue(e.currentStakeExact() > BigDecimal.ZERO)
    }
}
