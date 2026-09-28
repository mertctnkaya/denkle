import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';
import { useThemeStore } from './store/themeStore';

function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  // Geçici: Sisteme giriş yapmış mıyız?
  const isAuthenticated = true;

  return (
    <BrowserRouter>
      <Routes>
        {!isAuthenticated ? (
          <Route path="*" element={<Auth />} />
        ) : (
          <Route element={<MobileLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/parties" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Gruplar</h2></div>} />
            <Route path="/activity" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Hareketler</h2></div>} />
            <Route path="/profile" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Profil</h2></div>} />
            <Route path="*" element={<Home />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
