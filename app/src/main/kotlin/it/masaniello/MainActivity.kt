package it.masaniello

import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import org.json.JSONArray
import org.json.JSONObject
import java.math.BigDecimal
import java.math.RoundingMode

private fun euro(x: BigDecimal) = x.setScale(2, RoundingMode.HALF_UP).toPlainString() + " €"

private fun defaultOdds(q: BigDecimal = BigDecimal("2.00")) = MutableList(100) { q }

data class SlotState(
    var isConfigured: Boolean = false,
    var initialBankroll: BigDecimal = BigDecimal("35.00"),
    var totalEvents: Int = 10,
    var targetWins: Int = 7,
    var odds: MutableList<BigDecimal> = defaultOdds(),
    var results: MutableList<Result> = mutableListOf(),
    var actualStakes: MutableList<BigDecimal?> = mutableListOf(),
    var notes: MutableList<String> = mutableListOf()
)

class LocalStore(ctx: Context) {
    private val p = ctx.getSharedPreferences("masaphone_data_v2", Context.MODE_PRIVATE)

    fun save(slots: List<SlotState>) {
        try {
            val a = JSONArray()
            slots.forEach { s ->
                a.put(JSONObject().apply {
                    put("isConfigured", s.isConfigured)
                    put("initialBankroll", s.initialBankroll.toPlainString())
                    put("totalEvents", s.totalEvents)
                    put("targetWins", s.targetWins)
                    put("odds", JSONArray(s.odds.map { it.toPlainString() }))
                    put("results", JSONArray(s.results.map { it.name }))
                    put("actualStakes", JSONArray(s.actualStakes.map { it?.toPlainString() ?: "" }))
                    put("notes", JSONArray(s.notes))
                })
            }
            p.edit().putString("slots_v2", a.toString()).apply()
        } catch (_: Exception) {}
    }

    fun load(): MutableList<SlotState> {
        val raw = p.getString("slots_v2", null) ?: return MutableList(6) { SlotState() }
        return try {
            val a = JSONArray(raw)
            MutableList(6) { i ->
                if (i >= a.length()) {
                    SlotState()
                } else {
                    val o = a.getJSONObject(i)
                    val isConfigured = o.optBoolean("isConfigured", false)
                    val oldOdds = o.optJSONArray("odds")
                    val odds = MutableList(100) { j ->
                        val qStr = oldOdds?.optString(j, "2.00") ?: "2.00"
                        try {
                            val parsed = BigDecimal(qStr)
                            if (parsed > BigDecimal.ONE) parsed else BigDecimal("2.00")
                        } catch (_: Exception) {
                            BigDecimal("2.00")
                        }
                    }
                    val resArray = o.optJSONArray("results")
                    val results = mutableListOf<Result>()
                    if (resArray != null) {
                        for (j in 0 until resArray.length()) {
                            try {
                                results.add(Result.valueOf(resArray.getString(j)))
                            } catch (_: Exception) {}
                        }
                    }
                    val stArray = o.optJSONArray("actualStakes")
                    val stakes = mutableListOf<BigDecimal?>()
                    for (j in 0 until results.size) {
                        val x = stArray?.optString(j, "") ?: ""
                        if (x.isNotBlank()) {
                            try {
                                stakes.add(BigDecimal(x))
                            } catch (_: Exception) {
                                stakes.add(null)
                            }
                        } else {
                            stakes.add(null)
                        }
                    }
                    val notesArray = o.optJSONArray("notes")
                    val notes = mutableListOf<String>()
                    if (notesArray != null) {
                        for (j in 0 until notesArray.length()) {
                            notes.add(notesArray.optString(j, ""))
                        }
                    }

                    val bankrollStr = o.optString("initialBankroll", "35.00")
                    val bankroll = try { BigDecimal(bankrollStr) } catch (_: Exception) { BigDecimal("35.00") }
                    val totalEvents = o.optInt("totalEvents", 10).coerceIn(1, 100)
                    val targetWins = o.optInt("targetWins", 7).coerceIn(1, totalEvents)

                    SlotState(isConfigured, bankroll, totalEvents, targetWins, odds, results, stakes, notes)
                }
            }
        } catch (_: Exception) {
            MutableList(6) { SlotState() }
        }
    }
}

private fun rebuild(s: SlotState): MasanielloEngine {
    val e = MasanielloEngine(s.initialBankroll, s.totalEvents, s.targetWins, s.odds.toList())
    s.results.forEachIndexed { i, r ->
        if (!e.finished()) {
            if (i < s.odds.size) {
                e.updateCurrentOdds(s.odds[i])
            }
            val note = s.notes.getOrNull(i) ?: ""
            e.register(r, s.actualStakes.getOrNull(i), note)
        }
    }
    return e
}

// Dark Theme Color Scheme
private val DarkColors = darkColorScheme(
    primary = Color(0xFF64B5F6),
    onPrimary = Color(0xFF0D47A1),
    primaryContainer = Color(0xFF1E293B),
    onPrimaryContainer = Color(0xFFE2E8F0),
    secondary = Color(0xFF81C784),
    onSecondary = Color(0xFF1B5E20),
    secondaryContainer = Color(0xFF263238),
    onSecondaryContainer = Color(0xFFECEFF1),
    background = Color(0xFF121212),
    onBackground = Color(0xFFE0E0E0),
    surface = Color(0xFF1E1E1E),
    onSurface = Color(0xFFE0E0E0),
    surfaceVariant = Color(0xFF2A2A2A),
    onSurfaceVariant = Color(0xFFB0BEC5),
    error = Color(0xFFE57373),
    onError = Color(0xFF3700B3)
)

class MainActivity : ComponentActivity() {
    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        setContent {
            MaterialTheme(colorScheme = DarkColors) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    App(this)
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun App(ctx: Context) {
    val store = remember { LocalStore(ctx) }
    val slots = remember { store.load() }
    var version by remember { mutableIntStateOf(0) }
    var selected by remember { mutableIntStateOf(0) }
    var tab by remember { mutableIntStateOf(0) }
    var showConfig by remember { mutableStateOf(false) }
    var showResetConfirm by remember { mutableStateOf(false) }

    fun save() {
        store.save(slots)
        version++
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⚽ MasaPhone", fontWeight = FontWeight.Bold, color = Color(0xFF64B5F6))
                        Spacer(Modifier.width(8.dp))
                        Text(
                            "Money Management",
                            fontSize = 12.sp,
                            color = Color(0xFF90A4AE),
                            modifier = Modifier.padding(top = 3.dp)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF1A1A1A),
                    titleContentColor = Color.White
                )
            )
        }
    ) { pad ->
        Column(Modifier.padding(pad).fillMaxSize()) {
            TabRow(
                selectedTabIndex = tab,
                containerColor = Color(0xFF1E1E1E),
                contentColor = Color(0xFF64B5F6)
            ) {
                Tab(selected = (tab == 0), onClick = { tab = 0 }) {
                    Text("Progressioni", modifier = Modifier.padding(12.dp), fontWeight = FontWeight.SemiBold)
                }
                Tab(selected = (tab == 1), onClick = { tab = 1 }) {
                    Text("Bilancio", modifier = Modifier.padding(12.dp), fontWeight = FontWeight.SemiBold)
                }
            }

            if (tab == 0) {
                ScrollableTabRow(
                    selectedTabIndex = selected,
                    edgePadding = 12.dp,
                    containerColor = Color(0xFF161616),
                    contentColor = Color(0xFF64B5F6)
                ) {
                    slots.indices.forEach { i ->
                        val isCfg = slots[i].isConfigured
                        Tab(
                            selected = (selected == i),
                            onClick = { selected = i }
                        ) {
                            Row(
                                modifier = Modifier.padding(vertical = 10.dp, horizontal = 12.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    "Masa ${i + 1}",
                                    fontWeight = if (selected == i) FontWeight.Bold else FontWeight.Normal,
                                    color = if (selected == i) Color(0xFF64B5F6) else if (isCfg) Color(0xFFB0BEC5) else Color(0xFF616161)
                                )
                                if (!isCfg) {
                                    Text(" (vuoto)", fontSize = 10.sp, color = Color(0xFF757575))
                                }
                            }
                        }
                    }
                }

                val currentSlot = slots[selected]

                if (currentSlot.isConfigured) {
                    Row(
                        Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedButton(
                            onClick = { showConfig = true },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF90CAF9))
                        ) {
                            Text("⚙️ Configura")
                        }
                        Button(
                            onClick = { showResetConfirm = true },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828))
                        ) {
                            Text("🗑️ Azzera", color = Color.White)
                        }
                    }

                    key(version, selected) {
                        ProgressionScreen(currentSlot, ::save)
                    }
                } else {
                    // Empty Slot Screen
                    key(version, selected) {
                        EmptySlotScreen(
                            slotIndex = selected,
                            onConfigureClick = { showConfig = true }
                        )
                    }
                }
            } else {
                key(version) {
                    BalanceScreen(slots)
                }
            }
        }
    }

    if (showConfig) {
        ConfigDialog(
            slotIndex = selected,
            s = slots[selected],
            onCancel = { showConfig = false },
            onSave = {
                slots[selected].isConfigured = true
                save()
                showConfig = false
            }
        )
    }

    if (showResetConfirm) {
        AlertDialog(
            onDismissRequest = { showResetConfirm = false },
            containerColor = Color(0xFF242424),
            titleContentColor = Color.White,
            textContentColor = Color(0xFFE0E0E0),
            title = { Text("Azzera Masa ${selected + 1}") },
            text = {
                Text("Sei sicuro di voler azzerare questo Masaniello? La progressione verrà resettata e tornerà vuota in attesa di una nuova configurazione.")
            },
            confirmButton = {
                Button(
                    onClick = {
                        slots[selected] = SlotState(isConfigured = false)
                        save()
                        showResetConfirm = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFD32F2F))
                ) {
                    Text("Conferma e Svuota", color = Color.White, fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetConfirm = false }) {
                    Text("Annulla", color = Color(0xFF90CAF9))
                }
            }
        )
    }
}

@Composable
fun EmptySlotScreen(slotIndex: Int, onConfigureClick: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E)),
            shape = RoundedCornerShape(16.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF333333))
        ) {
            Column(
                modifier = Modifier.padding(24.dp).fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text(
                    "📊 Slot ${slotIndex + 1} Libero",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp,
                    color = Color(0xFFE0E0E0)
                )
                Text(
                    "Questo slot non è ancora stato configurato.\nImposta la tua cassa iniziale, il numero di eventi e l'obiettivo di vincite per visualizzare la vincita potenziale e iniziare la progressione.",
                    fontSize = 14.sp,
                    color = Color(0xFF9E9E9E),
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
                Spacer(Modifier.height(8.dp))
                Button(
                    onClick = onConfigureClick,
                    modifier = Modifier.fillMaxWidth().height(48.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text("⚡ Configura Masaniello ${slotIndex + 1}", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                }
            }
        }
    }
}

@Composable
private fun ConfigDialog(slotIndex: Int, s: SlotState, onCancel: () -> Unit, onSave: () -> Unit) {
    var bankroll by remember { mutableStateOf(if (s.isConfigured) s.initialBankroll.toPlainString() else "50.00") }
    var events by remember { mutableStateOf(if (s.isConfigured) s.totalEvents.toString() else "10") }
    var wins by remember { mutableStateOf(if (s.isConfigured) s.targetWins.toString() else "6") }
    var odd by remember { mutableStateOf(if (s.isConfigured) (s.odds.firstOrNull()?.toPlainString() ?: "2.00") else "2.00") }
    var error by remember { mutableStateOf("") }

    // Real-time calculation of potential payout
    val bVal = bankroll.replace(",", ".").toBigDecimalOrNull()
    val nVal = events.toIntOrNull()
    val wVal = wins.toIntOrNull()
    val qVal = odd.replace(",", ".").toBigDecimalOrNull()

    val isInputValid = bVal != null && bVal > BigDecimal.ZERO &&
            nVal != null && nVal in 1..100 &&
            wVal != null && wVal in 1..nVal &&
            qVal != null && qVal > BigDecimal.ONE

    val potentialPayout: Triple<BigDecimal, BigDecimal, BigDecimal>? = remember(bVal, nVal, wVal, qVal) {
        if (isInputValid) {
            try {
                val tempEngine = MasanielloEngine(bVal!!, nVal!!, wVal!!, List(nVal) { qVal!! })
                val finalB = tempEngine.potentialFinalBankroll()
                val profit = tempEngine.potentialNetProfit()
                val roi = if (bVal > BigDecimal.ZERO) {
                    profit.divide(bVal, 4, RoundingMode.HALF_UP).multiply(BigDecimal("100")).setScale(1, RoundingMode.HALF_UP)
                } else BigDecimal.ZERO
                Triple(finalB, profit, roi)
            } catch (_: Exception) {
                null
            }
        } else null
    }

    AlertDialog(
        onDismissRequest = onCancel,
        containerColor = Color(0xFF242424),
        titleContentColor = Color.White,
        textContentColor = Color(0xFFE0E0E0),
        title = { Text("Configura Masa ${slotIndex + 1}") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                if (s.isConfigured && s.results.isNotEmpty()) {
                    Text(
                        "⚠️ Progressione già avviata: per cambiare cassa o eventi totali, azzera prima lo slot.",
                        color = Color(0xFFEF5350),
                        fontSize = 12.sp
                    )
                }
                OutlinedTextField(
                    value = bankroll,
                    onValueChange = { bankroll = it; error = "" },
                    label = { Text("Cassa Iniziale (€) *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF64B5F6),
                        unfocusedBorderColor = Color(0xFF555555),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                )
                OutlinedTextField(
                    value = events,
                    onValueChange = { events = it; error = "" },
                    label = { Text("Numero Eventi Totali (1-100) *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF64B5F6),
                        unfocusedBorderColor = Color(0xFF555555),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                OutlinedTextField(
                    value = wins,
                    onValueChange = { wins = it; error = "" },
                    label = { Text("Vittorie Richieste / Obiettivo *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF64B5F6),
                        unfocusedBorderColor = Color(0xFF555555),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number)
                )
                OutlinedTextField(
                    value = odd,
                    onValueChange = { odd = it; error = "" },
                    label = { Text("Quota Base Predefinita *") },
                    singleLine = true,
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF64B5F6),
                        unfocusedBorderColor = Color(0xFF555555),
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                )

                // Potential Payout Live Card
                if (potentialPayout != null) {
                    val (finalB, profit, roi) = potentialPayout
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(10.dp))
                            .background(Color(0xFF0D2818))
                            .border(1.dp, Color(0xFF2E7D32), RoundedCornerShape(10.dp))
                            .padding(12.dp)
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                            Text(
                                "💰 VINCITA POTENZIALE STIMATA ($wVal su $nVal)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFA5D6A7)
                            )
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Cassa Finale Attesa:", fontSize = 13.sp, color = Color(0xFFE0E0E0))
                                Text(euro(finalB), fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color(0xFF66BB6A))
                            }
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text("Guadagno Netto:", fontSize = 13.sp, color = Color(0xFFB0BEC5))
                                Text(
                                    "${if (profit >= BigDecimal.ZERO) "+" else ""}${euro(profit)} (+${roi}%)",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF81C784)
                                )
                            }
                        }
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF1E293B))
                            .padding(10.dp)
                    ) {
                        Text(
                            "ℹ️ Compila tutti i 4 campi obbligatori per visualizzare la vincita potenziale stimata.",
                            fontSize = 12.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                }

                if (error.isNotBlank()) {
                    Text(error, color = Color(0xFFEF5350), fontSize = 13.sp)
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val b = bankroll.replace(",", ".").toBigDecimalOrNull()
                    val n = events.toIntOrNull()
                    val w = wins.toIntOrNull()
                    val q = odd.replace(",", ".").toBigDecimalOrNull()
                    error = when {
                        b == null || b <= BigDecimal.ZERO -> "Inserisci una cassa iniziale valida (es. 50.00)"
                        n == null || n < 1 || n > 100 -> "Inserisci il numero di eventi (da 1 a 100)"
                        w == null || w < 1 || w > n -> "Le vittorie richieste devono essere comprese tra 1 e $n"
                        q == null || q <= BigDecimal.ONE -> "La quota deve essere maggiore di 1.00 (es. 2.00)"
                        s.isConfigured && s.results.isNotEmpty() && (n != s.totalEvents || w != s.targetWins || b.compareTo(s.initialBankroll) != 0) ->
                            "Progressione già avviata: azzera prima di cambiare cassa o eventi"
                        else -> ""
                    }
                    if (error.isBlank()) {
                        s.initialBankroll = b!!
                        s.totalEvents = n!!
                        s.targetWins = w!!
                        if (s.results.isEmpty()) s.odds = defaultOdds(q!!)
                        else s.odds[s.results.size] = q!!
                        onSave()
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1976D2)),
                enabled = isInputValid || error.isNotBlank() || s.isConfigured
            ) {
                Text("Salva e Avvia", color = Color.White, fontWeight = FontWeight.Bold)
            }
        },
        dismissButton = {
            TextButton(onClick = onCancel) {
                Text("Annulla", color = Color(0xFF90CAF9))
            }
        }
    )
}

@Composable
fun ProgressionScreen(s: SlotState, save: () -> Unit) {
    val currentEventIdx = s.results.size
    val currentOddsVal = if (currentEventIdx < s.odds.size) s.odds[currentEventIdx] else BigDecimal("2.00")
    var oddText by remember(currentEventIdx, currentOddsVal) {
        mutableStateOf(currentOddsVal.toPlainString())
    }
    var actualText by remember(currentEventIdx) { mutableStateOf("") }
    var noteText by remember(currentEventIdx) { mutableStateOf("") }
    var message by remember { mutableStateOf("") }

    val engine = remember(s.initialBankroll, s.totalEvents, s.targetWins, s.odds.toList(), s.results.toList(), s.actualStakes.toList(), s.notes.toList()) {
        rebuild(s)
    }

    val expectedFinal = engine.potentialFinalBankroll()
    val expectedProfit = engine.potentialNetProfit()

    Column(Modifier.padding(horizontal = 16.dp, vertical = 6.dp).fillMaxSize()) {
        // Status Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1F2937)),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF374151))
        ) {
            Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        "Evento ${s.results.size + 1} di ${s.totalEvents}",
                        fontWeight = FontWeight.Bold,
                        fontSize = 17.sp,
                        color = Color.White
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("${engine.wins()} W", fontWeight = FontWeight.Bold, color = Color(0xFF81C784), fontSize = 15.sp)
                        Text(" / ", color = Color(0xFF757575), fontSize = 15.sp)
                        Text("${engine.losses()} L", fontWeight = FontWeight.Bold, color = Color(0xFFE57373), fontSize = 15.sp)
                    }
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Cassa Attuale: ${euro(engine.currentBankroll())}", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color(0xFF64B5F6))
                    Text("Target: ${s.targetWins} W su ${s.totalEvents}", fontSize = 13.sp, color = Color(0xFFB0BEC5))
                }
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                    Text("Vincita Potenziale Attesa:", fontSize = 12.sp, color = Color(0xFFA5D6A7))
                    Text(
                        "${euro(expectedFinal)} (${if (expectedProfit >= BigDecimal.ZERO) "+" else ""}${euro(expectedProfit)})",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF66BB6A)
                    )
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        if (!engine.finished()) {
            // Event Details Input
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E)),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF333333))
            ) {
                Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    // Note / Match Description input
                    OutlinedTextField(
                        value = noteText,
                        onValueChange = { noteText = it },
                        label = { Text("Promemoria Evento (es. Milan - Juve 1)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF64B5F6),
                            unfocusedBorderColor = Color(0xFF444444),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        )
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = oddText,
                            onValueChange = { oddText = it },
                            label = { Text("Quota") },
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF64B5F6),
                                unfocusedBorderColor = Color(0xFF444444),
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                        )
                        Button(
                            onClick = {
                                oddText.replace(",", ".").toBigDecimalOrNull()?.takeIf { it > BigDecimal.ONE }?.let {
                                    s.odds[s.results.size] = it
                                    message = "Quota aggiornata: $it"
                                    save()
                                } ?: run { message = "Quota non valida (> 1.00)" }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF374151))
                        ) {
                            Text("Aggiorna", color = Color.White)
                        }
                    }

                    // Recommended Stake Box
                    val rec = engine.currentStakeExact()
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF0F2E1B))
                            .border(1.dp, Color(0xFF2E7D32), RoundedCornerShape(8.dp))
                            .padding(10.dp)
                    ) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Text("Puntata Consigliata:", fontSize = 13.sp, color = Color(0xFFA5D6A7))
                            Text(euro(rec), fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color(0xFF66BB6A))
                        }
                    }

                    OutlinedTextField(
                        value = actualText,
                        onValueChange = { actualText = it },
                        label = { Text("Puntata effettiva (vuoto per consigliata)") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = true,
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = Color(0xFF64B5F6),
                            unfocusedBorderColor = Color(0xFF444444),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal)
                    )

                    if (message.isNotBlank()) {
                        Text(message, color = Color(0xFF64B5F6), fontSize = 12.sp)
                    }

                    // WIN / LOSS Buttons
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                        Button(
                            onClick = {
                                val a = actualText.replace(",", ".").toBigDecimalOrNull()
                                val stake = a ?: engine.currentStakeExact()
                                if (stake < BigDecimal.ZERO || stake > engine.currentBankroll()) {
                                    message = "Importo non valido (max ${euro(engine.currentBankroll())})"
                                    return@Button
                                }
                                s.results.add(Result.WIN)
                                s.actualStakes.add(a)
                                s.notes.add(noteText.trim())
                                save()
                                actualText = ""
                                noteText = ""
                                message = "✅ WIN registrato!"
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("VINTO (WIN)", fontWeight = FontWeight.Bold, color = Color.White)
                        }

                        Button(
                            onClick = {
                                val a = actualText.replace(",", ".").toBigDecimalOrNull()
                                val stake = a ?: engine.currentStakeExact()
                                if (stake < BigDecimal.ZERO || stake > engine.currentBankroll()) {
                                    message = "Importo non valido (max ${euro(engine.currentBankroll())})"
                                    return@Button
                                }
                                s.results.add(Result.LOSS)
                                s.actualStakes.add(a)
                                s.notes.add(noteText.trim())
                                save()
                                actualText = ""
                                noteText = ""
                                message = "❌ LOSS registrato"
                            },
                            modifier = Modifier.weight(1f).height(44.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("PERSO (LOSS)", fontWeight = FontWeight.Bold, color = Color.White)
                        }
                    }
                }
            }
        } else {
            val won = engine.wins() >= s.targetWins
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(
                    containerColor = if (won) Color(0xFF0F381E) else Color(0xFF381414)
                ),
                border = androidx.compose.foundation.BorderStroke(1.dp, if (won) Color(0xFF2E7D32) else Color(0xFFC62828))
            ) {
                Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        if (won) "🏆 OBIETTIVO RAGGIUNTO!" else "❌ PROGRESSIONE TERMINATA",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = if (won) Color(0xFF81C784) else Color(0xFFEF5350)
                    )
                    Text(
                        "Cassa finale: ${euro(engine.currentBankroll())}",
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 15.sp,
                        color = Color.White,
                        modifier = Modifier.padding(top = 4.dp)
                    )
                }
            }
        }

        Spacer(Modifier.height(10.dp))
        Text("Storico Eventi (${engine.history().size})", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Color(0xFFE0E0E0))
        Spacer(Modifier.height(4.dp))

        if (engine.history().isEmpty()) {
            Text("Nessun evento ancora giocato.", color = Color(0xFF757575), fontSize = 13.sp)
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                items(engine.history()) { ev ->
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        colors = CardDefaults.cardColors(
                            containerColor = if (ev.result == Result.WIN) Color(0xFF14241B) else Color(0xFF261818)
                        ),
                        border = androidx.compose.foundation.BorderStroke(
                            1.dp,
                            if (ev.result == Result.WIN) Color(0xFF1E4620) else Color(0xFF4A1C1C)
                        )
                    ) {
                        Row(
                            Modifier.padding(10.dp).fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column(Modifier.weight(1f)) {
                                if (ev.note.isNotBlank()) {
                                    Text(
                                        "📌 ${ev.note}",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = Color(0xFFE0E0E0)
                                    )
                                }
                                Text(
                                    "Evento ${ev.number} • Quota ${ev.odds}",
                                    fontSize = 12.sp,
                                    color = Color(0xFF90CAF9)
                                )
                                Text(
                                    "Giocata: ${euro(ev.actualStake)} | Cassa: ${euro(ev.bankrollAfter)}",
                                    fontSize = 12.sp,
                                    color = Color(0xFFB0BEC5)
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .background(
                                        if (ev.result == Result.WIN) Color(0xFF2E7D32) else Color(0xFFC62828),
                                        shape = RoundedCornerShape(4.dp)
                                    )
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    ev.result.name,
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 12.sp
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BalanceScreen(slots: List<SlotState>) {
    val configuredSlots = slots.filter { it.isConfigured }

    Column(Modifier.padding(16.dp).fillMaxSize()) {
        Text("Bilancio Generale", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold, color = Color.White)
        Spacer(Modifier.height(12.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF334155))
        ) {
            Column(Modifier.padding(14.dp)) {
                val totalEvents = configuredSlots.sumOf { it.results.size }
                val totalWins = configuredSlots.sumOf { it.results.count { r -> r == Result.WIN } }
                val totalLosses = configuredSlots.sumOf { it.results.count { r -> r == Result.LOSS } }
                val initialTotal = configuredSlots.sumOf { it.initialBankroll }
                val currentTotal = configuredSlots.sumOf { rebuild(it).currentBankroll() }
                val diff = currentTotal.subtract(initialTotal)

                Text("Masa attivi configurati: ${configuredSlots.size} su 6", fontSize = 13.sp, color = Color(0xFF94A3B8))
                Text("Totale eventi giocati: $totalEvents", fontWeight = FontWeight.SemiBold, color = Color.White)
                Text("Vittorie: $totalWins | Sconfitte: $totalLosses", fontSize = 14.sp, color = Color(0xFFCBD5E1))
                Spacer(Modifier.height(6.dp))
                Text("Cassa iniziale complessiva: ${euro(initialTotal)}", fontSize = 14.sp, color = Color(0xFF94A3B8))
                Text("Cassa attuale complessiva: ${euro(currentTotal)}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Text(
                    "Utile / Perdita: ${if (diff >= BigDecimal.ZERO) "+" else ""}${euro(diff)}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = if (diff >= BigDecimal.ZERO) Color(0xFF81C784) else Color(0xFFE57373)
                )
            }
        }

        Spacer(Modifier.height(16.dp))
        Text("Riepilogo Slot", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Color.White)
        Spacer(Modifier.height(8.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(slots.indices.toList()) { i ->
                val s = slots[i]
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = if (s.isConfigured) Color(0xFF1E1E1E) else Color(0xFF161616)),
                    border = androidx.compose.foundation.BorderStroke(1.dp, if (s.isConfigured) Color(0xFF333333) else Color(0xFF222222))
                ) {
                    Column(Modifier.padding(12.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Masa ${i + 1}", fontWeight = FontWeight.Bold, color = if (s.isConfigured) Color(0xFF64B5F6) else Color(0xFF757575))
                            if (s.isConfigured) {
                                val e = rebuild(s)
                                Text("${e.wins()} W / ${e.losses()} L", color = Color(0xFF81C784))
                            } else {
                                Text("Non configurato", fontSize = 12.sp, color = Color(0xFF616161))
                            }
                        }
                        if (s.isConfigured) {
                            val e = rebuild(s)
                            Text("Eventi: ${s.results.size} / ${s.totalEvents} (Target ${s.targetWins} W)", fontSize = 12.sp, color = Color(0xFF9E9E9E))
                            Text("Cassa: ${euro(e.currentBankroll())} (Iniziale ${euro(s.initialBankroll)})", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                        }
                    }
                }
            }
        }
    }
}
