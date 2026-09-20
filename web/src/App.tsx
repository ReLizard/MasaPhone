import React, { useState, useEffect } from 'react';
import { SlotConfig, createEmptySlot } from './core/MasanielloEngine';
import { loadSlots, saveSlots } from './core/storage';
import { Header } from './components/Header';
import { SlotTabs } from './components/SlotTabs';
import { ProgressionView } from './components/ProgressionView';
import { EmptySlotView } from './components/EmptySlotView';
import { BalanceView } from './components/BalanceView';
import { ConfigModal } from './components/ConfigModal';
import { BackupModal } from './components/BackupModal';
import { InfoModal } from './components/InfoModal';

export const App: React.FC = () => {
  const [slots, setSlots] = useState<SlotConfig[]>(() => loadSlots());
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'progressions' | 'balance'>('progressions');

  // Modals
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [backupMode, setBackupMode] = useState<'export' | 'import' | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  useEffect(() => {
    saveSlots(slots);
  }, [slots]);

  const currentSlot = slots[selectedSlotIndex] || createEmptySlot(selectedSlotIndex);

  const handleUpdateCurrentSlot = (updated: SlotConfig) => {
    const nextSlots = [...slots];
    nextSlots[selectedSlotIndex] = updated;
    setSlots(nextSlots);
  };

  const handleResetCurrentSlot = () => {
    const nextSlots = [...slots];
    nextSlots[selectedSlotIndex] = createEmptySlot(selectedSlotIndex);
    setSlots(nextSlots);
  };

  const handleImportSuccess = (newSlots: SlotConfig[]) => {
    setSlots(newSlots);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Header with Tab Switcher */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onExport={() => setBackupMode('export')}
        onImport={() => setBackupMode('import')}
        onInfo={() => setIsInfoOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {activeTab === 'progressions' ? (
          <>
            {/* Slot Switcher (Masa 1 .. Masa 6) */}
            <SlotTabs
              slots={slots}
              selectedIndex={selectedSlotIndex}
              onSelect={setSelectedSlotIndex}
            />

            {/* Progression Screen or Empty State */}
            <div className="p-4 flex-1">
              {currentSlot.isConfigured ? (
                <ProgressionView
                  key={selectedSlotIndex}
                  slot={currentSlot}
                  slotIndex={selectedSlotIndex}
                  onUpdate={handleUpdateCurrentSlot}
                  onOpenConfig={() => setIsConfigOpen(true)}
                  onReset={handleResetCurrentSlot}
                />
              ) : (
                <EmptySlotView
                  key={selectedSlotIndex}
                  slotIndex={selectedSlotIndex}
                  onConfigureClick={() => setIsConfigOpen(true)}
                />
              )}
            </div>
          </>
        ) : (
          /* Multi-Masaniello Balance Overview */
          <div className="p-4 flex-1">
            <BalanceView
              slots={slots}
              onSelectSlot={(idx) => {
                setSelectedSlotIndex(idx);
                setActiveTab('progressions');
              }}
            />
          </div>
        )}
      </main>

      {/* Configuration Dialog */}
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        slot={currentSlot}
        slotIndex={selectedSlotIndex}
        onSave={handleUpdateCurrentSlot}
      />

      {/* Import / Export Modal */}
      <BackupModal
        isOpen={backupMode !== null}
        onClose={() => setBackupMode(null)}
        slots={slots}
        onImportSuccess={handleImportSuccess}
        mode={backupMode || 'export'}
      />

      {/* Info & Installation Guide Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
};

export default App;
