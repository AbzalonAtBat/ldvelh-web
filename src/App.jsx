import React, { useState } from 'react';
import Layout from './components/Layout';
import { GameProvider } from './context/GameContext';
import CharacterSheet from './screens/CharacterSheet';
import ChapterHistory from './screens/ChapterHistory';
import AdventureManager from './screens/AdventureManager';
import CombatScreen from './screens/CombatScreen';

function AppContent() {
  const [activeTab, setActiveTab] = useState('character');
  const [showCombat, setShowCombat] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'character': return <CharacterSheet onStartCombat={() => setShowCombat(true)} />;
      case 'history': return <ChapterHistory />;
      case 'adventures': return <AdventureManager />;
      default: return <CharacterSheet />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}

      {showCombat && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="w-full max-w-2xl vintage-container max-h-[90vh] overflow-auto">
            <CombatScreen onClose={() => setShowCombat(false)} />
          </div>
        </div>
      )}
    </Layout>
  );
}

function App() {
  return (
    <GameProvider>
      <AppContent />
    </GameProvider>
  );
}

export default App;
