import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MobileLayout } from './components/layout/MobileLayout';
import { Home } from './pages/Home';
import { Auth } from './pages/Auth';

function App() {
  // Geçici: Sisteme giriş yapmış mıyız? (Zustand authStore'a bağlanana kadar)
  const isAuthenticated = true; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Giriş yapmamış kullanıcılar için Auth sayfası */}
        {!isAuthenticated ? (
          <Route path="*" element={<Auth />} />
        ) : (
          /* Giriş yapmış kullanıcılar için ana mobil arayüz */
          <Route element={<MobileLayout />}>
            <Route path="/" element={<Home />} />
            {/* Diğer sayfalar buraya gelecek */}
            <Route path="/parties" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Gruplar</h2></div>} />
            <Route path="/activity" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Hareketler</h2></div>} />
            <Route path="/profile" element={<div className="p-6 pt-12"><h2 className="font-bold text-xl">Profil</h2></div>} />
            
            {/* Eşleşmeyen yollar Ana Sayfa'ya */}
            <Route path="*" element={<Home />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
