import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import contentData from './content/content.json';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import ModeSelect from './pages/ModeSelect';
import ModulesList from './pages/ModulesList';
import SkillsList from './pages/SkillsList';
import SessionRunner from './pages/SessionRunner';
import Review from './pages/Review';
import Progress from './pages/Progress';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import { Content } from './types/content';
import { AppState } from './types/state';
import { loadState, saveState } from './lib/storage';
import { validateContent } from './lib/content';

interface AppContextValue {
  content: Content;
  state: AppState;
  setState: (state: AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('AppContext is not available');
  }
  return ctx;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const validation = useMemo(() => validateContent(contentData as Content), []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  if (!validation.valid) {
    return (
      <div className="app">
        <ErrorPage message={validation.error ?? 'Content failed to load.'} />
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ content: contentData as Content, state, setState }}>
      <div className="app">
        <TopBar xpTotal={state.xpTotal} streakCount={state.streakCount} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mode" element={<ModeSelect />} />
            <Route path="/modules/:mode" element={<ModulesList />} />
            <Route path="/module/:mode/:moduleId" element={<SkillsList />} />
            <Route path="/session/:mode/:moduleId/:skillId" element={<SessionRunner />} />
            <Route path="/review" element={<Review />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </AppContext.Provider>
  );
}