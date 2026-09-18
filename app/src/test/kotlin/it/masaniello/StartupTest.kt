package it.masaniello

import org.junit.Test
import java.math.BigDecimal

class StartupTest {
    @Test
    fun testStartupRebuild() {
        val slots = MutableList(6) { SlotState() }
        for (slot in slots) {
            val engine = MasanielloEngine(slot.initialBankroll, slot.totalEvents, slot.targetWins, slot.odds.toList())
            val stake = engine.currentStakeExact()
            println("Initial stake: $stake")
        }
    }
}
