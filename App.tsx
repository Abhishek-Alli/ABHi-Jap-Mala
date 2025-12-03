import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Plus, 
  Settings, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  History, 
  RotateCcw,
  Trash2,
  Check,
  Info,
  ChevronRight,
  Code
} from 'lucide-react';
import { AppState, Mantra, FloatingText } from './types';
import { loadState, saveState } from './utils/storage';
import { TRANSLATIONS, BEADS_PER_MALA, BELL_SOUND_URL } from './constants';
import { CircularProgress } from './components/CircularProgress';
import { FloatingTextItem } from './components/FloatingText';

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(loadState);
  const [view, setView] = useState<'home' | 'counter' | 'settings' | 'add' | 'about'>('home');
  const [newMantraName, setNewMantraName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  
  // Floating text animation state
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  // Audio Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Derived state
  const t = TRANSLATIONS[appState.language];
  const activeMantra = appState.mantras.find(m => m.id === appState.selectedMantraId);
  const isDevotionalFont = appState.language === 'hi' ? 'font-hindi' : 'font-devotional';

  // Effects
  useEffect(() => {
    saveState(appState);
  }, [appState]);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio(BELL_SOUND_URL);
  }, []);

  // Helpers
  const playBell = useCallback(() => {
    if (appState.soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log("Audio play failed interaction required", e));
    }
  }, [appState.soundEnabled]);

  const hapticFeedback = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  // Actions
  const addMantra = () => {
    if (!newMantraName.trim()) return;
    const newMantra: Mantra = {
      id: Date.now().toString(),
      name: newMantraName,
      totalLifetimeCounts: 0,
      totalLifetimeMalas: 0,
      todayCounts: 0,
      todayMalas: 0,
      currentStep: 0,
    };
    setAppState(prev => ({
      ...prev,
      mantras: [newMantra, ...prev.mantras], // Add to top
    }));
    setNewMantraName('');
    setView('home');
  };

  const deleteMantra = (id: string) => {
    setAppState(prev => ({
      ...prev,
      mantras: prev.mantras.filter(m => m.id !== id),
      selectedMantraId: prev.selectedMantraId === id ? null : prev.selectedMantraId
    }));
    setShowDeleteConfirm(null);
  };

  const selectMantra = (id: string) => {
    setAppState(prev => ({ ...prev, selectedMantraId: id }));
    setView('counter');
  };

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    if (!activeMantra) return;

    // Visual Effect (Floating Text)
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const newFloat: FloatingText = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      text: activeMantra.name
    };
    setFloatingTexts(prev => [...prev, newFloat]);
    // Cleanup float after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1000);

    hapticFeedback();

    setAppState(prev => {
      const mantras = prev.mantras.map(m => {
        if (m.id !== activeMantra.id) return m;

        let nextStep = m.currentStep + 1;
        let todayMalas = m.todayMalas;
        let lifetimeMalas = m.totalLifetimeMalas;

        if (nextStep >= BEADS_PER_MALA) {
          playBell();
          nextStep = 0; // Reset step
          todayMalas += 1;
          lifetimeMalas += 1;
        }

        return {
          ...m,
          currentStep: nextStep,
          totalLifetimeCounts: m.totalLifetimeCounts + 1,
          todayCounts: m.todayCounts + 1,
          todayMalas,
          totalLifetimeMalas: lifetimeMalas
        };
      });
      return { ...prev, mantras };
    });
  };

  const stepBack = () => {
    if (!activeMantra || activeMantra.currentStep === 0) return;
    
    setAppState(prev => {
      const mantras = prev.mantras.map(m => {
        if (m.id !== activeMantra.id) return m;
        // Logic: step back to 0, but NOT back a mala (as per user request)
        return {
          ...m,
          currentStep: Math.max(0, m.currentStep - 1),
          // We also decrement totals to keep stats accurate for today? 
          // Usually strict Japa means if you reverse, you undo the chant. 
          // But strict Mala count shouldn't decrease easily.
          todayCounts: Math.max(0, m.todayCounts - 1),
          totalLifetimeCounts: Math.max(0, m.totalLifetimeCounts - 1),
        };
      });
      return { ...prev, mantras };
    });
  };

  const resetCurrentMala = () => {
    if (!confirm("Reset current mala progress?")) return;
    setAppState(prev => {
        const mantras = prev.mantras.map(m => {
            if (m.id !== activeMantra?.id) return m;
            return { ...m, currentStep: 0 };
        });
        return { ...prev, mantras };
    });
  };

  // --- UI RENDERERS ---

  const renderHome = () => (
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold text-saffron-500 tracking-wide font-devotional">{t.appTitle}</h1>
        <button onClick={() => setView('settings')} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
          <Settings size={24} />
        </button>
      </div>

      {/* Main Action */}
      <button 
        onClick={() => setView('add')}
        className="flex items-center justify-center w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-2xl shadow-lg shadow-orange-900/40 text-white font-semibold text-lg hover:brightness-110 active:scale-95 transition-all"
      >
        <Plus className="mr-2" /> {t.addMantra}
      </button>

      {/* Mantra List */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-20">
        {appState.mantras.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4 text-orange-700">
               <span className="text-2xl">ॐ</span>
            </div>
            <p>{t.noMantras}</p>
          </div>
        ) : (
          appState.mantras.map(m => (
            <div key={m.id} className="bg-zinc-800 border border-zinc-700 rounded-xl p-5 flex flex-col shadow-sm relative overflow-hidden group">
               {/* Selection Area */}
               <div onClick={() => selectMantra(m.id)} className="cursor-pointer">
                  {/* Row 1: Name and Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-3xl font-semibold text-white pr-4 ${isDevotionalFont} leading-tight`}>{m.name}</h3>
                    {m.currentStep > 0 && (
                        <span className="shrink-0 text-xs font-bold bg-orange-900/50 text-orange-400 px-2 py-1 rounded-full border border-orange-800 mt-1">
                            {m.currentStep}/{BEADS_PER_MALA}
                        </span>
                    )}
                  </div>
                  
                  {/* Row 2: Detailed Stats (Vertical Stack) */}
                  <div className="flex flex-col space-y-2 mt-2 pt-2 border-t border-zinc-700/50">
                    {/* Today Stats */}
                    <div className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 mt-0.5"></span>
                        <div className="text-zinc-400">
                           <span className="text-zinc-500">{t.todayMalasLabel} : </span>
                           <span className="text-zinc-200 font-medium tracking-wide">
                             {m.todayMalas} {t.malas} ({m.todayCounts} {t.naam})
                           </span>
                        </div>
                    </div>
                    
                    {/* Lifetime Stats */}
                    <div className="flex items-center text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-2 mt-0.5"></span>
                        <div className="text-zinc-400">
                           <span className="text-zinc-500">{t.lifetimeMalasLabel} : </span>
                           <span className="text-orange-400 font-medium tracking-wide">
                             {m.totalLifetimeMalas} {t.malas} ({m.totalLifetimeCounts} {t.naam})
                           </span>
                        </div>
                    </div>
                  </div>
               </div>

               {/* Delete Action (Top Right) */}
               <button 
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(m.id); }}
                className="absolute top-2 right-2 p-2 text-zinc-600 hover:text-red-400 transition-colors z-10"
               >
                 <Trash2 size={18} />
               </button>

               {/* Delete Confirmation Overlay */}
               {showDeleteConfirm === m.id && (
                 <div className="absolute inset-0 bg-zinc-900/95 flex items-center justify-center p-4 z-20 flex-col text-center animate-fade-in">
                    <p className="text-sm text-white mb-4">{t.confirmDelete}</p>
                    <div className="flex space-x-3">
                        <button onClick={() => deleteMantra(m.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm">{t.delete}</button>
                        <button onClick={() => setShowDeleteConfirm(null)} className="px-3 py-1 bg-zinc-700 text-white rounded text-sm">{t.cancel}</button>
                    </div>
                 </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAddMantra = () => (
    <div className="flex flex-col h-full p-6">
        <div className="flex items-center mb-8">
            <button onClick={() => setView('home')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold ml-2 text-white">{t.addMantra}</h2>
        </div>
        
        <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
            <label className="block text-sm font-medium text-orange-500 mb-2 uppercase tracking-wider">{t.startChanting}</label>
            <textarea
                autoFocus
                value={newMantraName}
                onChange={(e) => setNewMantraName(e.target.value)}
                placeholder={t.enterMantraPlaceholder}
                className={`w-full bg-zinc-900 text-white border border-zinc-700 rounded-lg p-4 text-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none ${isDevotionalFont}`}
                rows={3}
            />
            
            <div className="flex mt-6 space-x-3">
                <button onClick={() => setView('home')} className="flex-1 py-3 bg-zinc-700 rounded-xl text-white font-medium">{t.cancel}</button>
                <button onClick={addMantra} className="flex-1 py-3 bg-orange-600 rounded-xl text-white font-medium shadow-lg shadow-orange-900/20">{t.save}</button>
            </div>
        </div>
    </div>
  );

  const renderCounter = () => {
    if (!activeMantra) return null;

    // Helper to calculate dynamic font size
    const getMantraFontSize = (name: string) => {
        const text = name.trim();
        const wordCount = text.split(/\s+/).length;
        const charCount = text.length;

        // Extremely long (e.g., long verses)
        if (charCount > 40 || wordCount > 6) {
            return "text-2xl md:text-3xl"; 
        }
        // Medium long (e.g., "Om Namo Bhagavate Vasudevaya")
        if (charCount > 18 || wordCount > 3) {
            return "text-3xl md:text-5xl";
        }
        // Short/Standard (e.g., "Radha", "Ram", "Om Namah Shivaya")
        return "text-5xl md:text-7xl";
    };

    return (
      <div className="flex flex-col h-full bg-black relative overflow-hidden">
        {/* Top Bar */}
        <div 
            className="flex justify-between items-center p-4 z-30 relative bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()} // Prevent header clicks from counting
        >
            <button onClick={() => setView('home')} className="p-2 text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft size={28} />
            </button>
            <div className="flex items-center space-x-4">
               <button onClick={resetCurrentMala} className="text-zinc-500 hover:text-white transition-colors"><RotateCcw size={20}/></button>
               <button onClick={() => setAppState(s => ({...s, soundEnabled: !s.soundEnabled}))} className={`transition-colors ${appState.soundEnabled ? 'text-orange-500' : 'text-zinc-600'}`}>
                   {appState.soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
               </button>
            </div>
        </div>

        {/* Floating Text Container */}
        {floatingTexts.map(ft => (
          <FloatingTextItem key={ft.id} text={ft.text} x={ft.x} y={ft.y} className={isDevotionalFont} />
        ))}

        {/* Main Click Area - Flex Layout for Centered Content */}
        <div 
          className="flex-1 flex flex-col items-center justify-center z-10 select-none relative w-full pb-20 space-y-8"
          onClick={handleTap} 
        >
             {/* Mantra Name and Stats Group */}
             <div className="flex flex-col items-center text-center px-4 animate-fade-in pointer-events-none w-full max-w-md">
                {/* Large Mantra Name with Dynamic Size */}
                <h2 className={`${getMantraFontSize(activeMantra.name)} font-bold text-orange-50 mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${isDevotionalFont} leading-tight transition-all duration-300`}>
                    {activeMantra.name}
                </h2>

                {/* Stacked Stats Below Name */}
                <div className="flex flex-col space-y-2 bg-zinc-900/60 p-4 rounded-xl border border-white/5 backdrop-blur-md shadow-2xl w-full max-w-[320px]">
                    {/* Today */}
                    <p className="text-sm md:text-base text-zinc-300 font-medium tracking-wide flex justify-between items-center">
                        <span className="text-zinc-400 shrink-0">{t.todayMalasLabel} :</span>
                        <span className="text-right">
                            <span className="text-orange-400 font-bold">{activeMantra.todayMalas} {t.malas}</span>
                            <span className="text-zinc-500 ml-1 text-xs whitespace-nowrap">({activeMantra.todayCounts} {t.naam})</span>
                        </span>
                    </p>
                    
                    <div className="h-px bg-white/5 w-full my-1"></div>
                    
                    {/* Lifetime */}
                    <p className="text-sm md:text-base text-zinc-300 font-medium tracking-wide flex justify-between items-center">
                        <span className="text-zinc-400 shrink-0">{t.lifetimeMalasLabel} :</span>
                        <span className="text-right">
                            <span className="text-white font-bold">{activeMantra.totalLifetimeMalas} {t.malas}</span>
                            <span className="text-zinc-500 ml-1 text-xs whitespace-nowrap">({activeMantra.totalLifetimeCounts} {t.naam})</span>
                        </span>
                    </p>
                </div>
             </div>

             {/* Circular Progress */}
             <div className="relative transform active:scale-95 transition-transform duration-100 touch-manipulation">
                 <CircularProgress count={activeMantra.currentStep} />
                 
                 {/* Count in Center */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                     <span className="text-8xl font-bold text-white tracking-tighter tabular-nums drop-shadow-2xl font-sans">
                         {activeMantra.currentStep}
                     </span>
                     <span className="text-xs text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2 opacity-60">
                        {BEADS_PER_MALA}
                     </span>
                 </div>
             </div>
        </div>

        {/* Step Back Control */}
        <button 
            onClick={(e) => { e.stopPropagation(); stepBack(); }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white active:bg-zinc-800 z-30 transition-all shadow-lg hover:shadow-orange-900/10"
            aria-label={t.back}
        >
            <RotateCcw size={22} className="-scale-x-100" /> {/* Mirror icon for 'back step' visual */}
        </button>

        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full p-6 bg-zinc-900">
        <div className="flex items-center mb-8">
            <button onClick={() => setView('home')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold ml-2 text-white">{t.settings}</h2>
        </div>

        <div className="space-y-4">
            {/* Language */}
            <div className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center">
                <span className="text-lg">{t.language}</span>
                <div className="flex bg-zinc-900 p-1 rounded-lg">
                    <button 
                        onClick={() => setAppState(s => ({...s, language: 'en'}))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${appState.language === 'en' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500'}`}
                    >
                        English
                    </button>
                    <button 
                        onClick={() => setAppState(s => ({...s, language: 'hi'}))}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${appState.language === 'hi' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500'}`}
                    >
                        हिंदी
                    </button>
                </div>
            </div>

            {/* Sound */}
            <div className="bg-zinc-800 p-4 rounded-xl flex justify-between items-center cursor-pointer" onClick={() => setAppState(s => ({...s, soundEnabled: !s.soundEnabled}))}>
                <div className="flex items-center">
                    <Volume2 className="mr-3 text-orange-500" size={20} />
                    <span className="text-lg">{t.sound}</span>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${appState.soundEnabled ? 'bg-orange-600' : 'bg-zinc-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${appState.soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>

            {/* Developer / About Link */}
            <button 
                onClick={() => setView('about')}
                className="w-full bg-zinc-800 p-4 rounded-xl flex justify-between items-center hover:bg-zinc-700 transition-colors"
            >
                <div className="flex items-center">
                    <Info className="mr-3 text-orange-500" size={20} />
                    <span className="text-lg">{t.about}</span>
                </div>
                <ChevronRight className="text-zinc-500" size={20} />
            </button>

            <div className="p-4 text-center text-zinc-500 text-sm mt-10">
                <p>ABHi Jap Mala v1.0</p>
                <p className="mt-2 text-xs">May your practice bring peace.</p>
            </div>
        </div>
    </div>
  );

  const renderAbout = () => (
    <div className="flex flex-col h-full p-6 bg-zinc-900 overflow-y-auto">
        <div className="flex items-center mb-6">
            <button onClick={() => setView('settings')} className="p-2 -ml-2 text-zinc-400 hover:text-white">
                <ChevronLeft size={28} />
            </button>
            <h2 className="text-2xl font-bold ml-2 text-white">{t.about}</h2>
        </div>

        <div className="space-y-8 pb-10">
            {/* Developer Card */}
            <div className="bg-zinc-800 p-8 rounded-2xl border border-zinc-700 text-center shadow-lg">
                 <div className="w-20 h-20 bg-orange-900/20 rounded-full mx-auto flex items-center justify-center mb-4 text-orange-500 border border-orange-500/20">
                    <Code size={32} />
                 </div>
                 <h3 className="text-sm uppercase tracking-widest text-zinc-500 mb-2">{t.developedBy}</h3>
                 <p className="text-2xl text-orange-400 font-serif mb-4 font-bold tracking-wide">{t.developerName}</p>
                 <div className="h-px w-16 bg-zinc-700 mx-auto mb-4"></div>
                 <p className="text-zinc-500 text-xs">© {new Date().getFullYear()} {t.rightsReserved}</p>
            </div>

            {/* How to Use */}
            <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white border-l-4 border-orange-500 pl-4">{t.howToUseTitle}</h3>
                <ul className="space-y-4 bg-zinc-800/50 p-6 rounded-xl border border-zinc-800">
                    {t.howToUseSteps.map((step: string, i: number) => (
                        <li key={i} className="flex items-start text-zinc-300">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-900/50 text-orange-500 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 border border-orange-900">
                                {i + 1}
                            </span>
                            <span className="text-sm leading-relaxed">{step}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            <div className="text-center text-zinc-700 text-xs pt-4">
                Designed with devotion.
            </div>
        </div>
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-zinc-900 text-zinc-100 relative overflow-hidden shadow-2xl">
      {view === 'home' && renderHome()}
      {view === 'add' && renderAddMantra()}
      {view === 'counter' && renderCounter()}
      {view === 'settings' && renderSettings()}
      {view === 'about' && renderAbout()}
    </div>
  );
};

export default App;