import React from 'react';
import { X, BookOpen, Smartphone, ShieldCheck, Zap } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1c1c] border border-[#333333] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b2b2b] bg-[#222222]">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">MasaPhone - Guida & Info</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2e2e2e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto text-xs text-gray-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-3.5 rounded-xl bg-[#222222] border border-[#2d2d2d] space-y-1.5">
            <h3 className="text-sm font-bold text-sky-400 flex items-center space-x-1.5">
              <Zap className="w-4 h-4" />
              <span>Cos'è il Metodo Masaniello?</span>
            </h3>
            <p>
              Il Masaniello è un celebre algoritmo matematico di <b>Money Management</b> che permette di ottimizzare la cassa impostando un numero totale di eventi (N) e quanti se ne prevede di vincere (K).
            </p>
            <p>
              A differenza delle progressioni tradizionali (come il raddoppio o Martingala), il Masaniello ricalcola ad ogni passaggio la puntata esatta in modo da preservare il capitale e garantire una resa prestabilita costante.
            </p>
          </div>

          {/* Section 2: PWA Install on iOS & Android */}
          <div className="p-3.5 rounded-xl bg-[#222222] border border-[#2d2d2d] space-y-1.5">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Come installare su iPhone (iOS) e Android</span>
            </h3>
            <ul className="list-disc pl-4 space-y-1 text-gray-300">
              <li>
                <b>Su iPhone / iPad (Safari)</b>: Premi il pulsante <i>Condividi</i> (icona con quadrato e freccia verso l'alto in basso) e seleziona <b>"Aggiungi a schermata Home"</b>.
              </li>
              <li>
                <b>Su Android (Chrome)</b>: Premi i tre puntini in alto a destra e seleziona <b>"Installa app"</b> o <b>"Aggiungi a schermata Home"</b>.
              </li>
            </ul>
            <p className="text-[11px] text-gray-400 mt-1">
              L'app si aprirà a schermo intero senza barre del browser e funzionerà anche completamente <b>offline</b>!
            </p>
          </div>

          {/* Section 3: Privacy & Security */}
          <div className="p-3.5 rounded-xl bg-[#222222] border border-[#2d2d2d] space-y-1.5">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Salvataggio Locale & Privacy Totale</span>
            </h3>
            <p>
              Tutti i dati, le progressioni e le puntate rimangono salvati esclusivamente nella memoria locale del tuo browser. Nessun dato viene inviato a server esterni.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-[#2b2b2b] bg-[#202020] text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-sky-500/20"
          >
            Ho capito
          </button>
        </div>
      </div>
    </div>
  );
};
