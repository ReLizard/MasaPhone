import React, { useState } from 'react';
import { SlotConfig } from '../core/MasanielloEngine';
import { exportAllData, importAllData } from '../core/storage';
import { X, Download, Upload, Copy, Check, AlertCircle } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: SlotConfig[];
  onImportSuccess: (slots: SlotConfig[]) => void;
  mode: 'export' | 'import';
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  slots,
  onImportSuccess,
  mode,
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const exportText = exportAllData(slots);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([exportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `masaphone_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setError('');
    if (!importText.trim()) {
      setError('Incolla il contenuto JSON di backup.');
      return;
    }
    const imported = importAllData(importText.trim());
    if (imported) {
      onImportSuccess(imported);
      onClose();
    } else {
      setError('Formato JSON non valido. Controlla il testo incollato.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1c1c] border border-[#333333] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2b2b2b] bg-[#222222]">
          <div className="flex items-center space-x-2">
            {mode === 'export' ? (
              <Download className="w-5 h-5 text-sky-400" />
            ) : (
              <Upload className="w-5 h-5 text-sky-400" />
            )}
            <h2 className="text-base font-bold text-white">
              {mode === 'export' ? 'Esporta Backup Dati' : 'Ripristina Backup Dati'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#2e2e2e] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 overflow-y-auto">
          {mode === 'export' ? (
            <>
              <p className="text-xs text-gray-400 leading-relaxed">
                Puoi salvare il backup delle tue progressioni sul tuo dispositivo o copiare il testo JSON per trasferirlo su un altro telefono/computer:
              </p>

              <textarea
                readOnly
                value={exportText}
                rows={7}
                className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[11px] font-mono text-gray-300 focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2.5 px-3 bg-[#2a2a2a] hover:bg-[#333333] text-gray-200 text-xs font-semibold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiato!' : 'Copia Testo'}</span>
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="flex-1 py-2.5 px-3 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 shadow-lg shadow-sky-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Scarica File .json</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-400 leading-relaxed">
                Incolla il testo JSON del backup o seleziona un file precedentemente esportato:
              </p>

              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="text-xs text-gray-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#2a2a2a] file:text-sky-400 hover:file:bg-[#333333] file:cursor-pointer"
                />
              </div>

              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Incolla qui il JSON {"slots": [...] }'
                rows={7}
                className="w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[11px] font-mono text-gray-200 focus:outline-none focus:border-sky-500 transition-colors"
              />

              {error && (
                <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleImportSubmit}
                className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all"
              >
                Importa e Sostituisci Dati
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
