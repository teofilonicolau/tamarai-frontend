import React, { useState, useEffect } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';

const Layout = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // 🎯 Inicializar tema do localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('tamaruse-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
    setDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  // 🎨 Atualizar tema no DOM
  const updateTheme = (isDark) => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('tamaruse-theme', isDark ? 'dark' : 'light');
  };

  // 🔄 Toggle do tema
  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    updateTheme(newDarkMode);
  };

  // 📱 Responsividade da sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Verificar no mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen transition-theme" style={{
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      
      {/* 🎯 SIDEBAR COM TEMA */}
      <Sidebar 
        expanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
      
      {/* 📱 ÁREA PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-hidden transition-theme">
        
        {/* 🏗️ HEADER FIXO */}
        <Header darkMode={darkMode} onToggleTheme={toggleTheme} />
        
        {/* 📄 CONTEÚDO PRINCIPAL */}
        <main 
          className="flex-1 overflow-y-auto transition-theme"
          style={{
            background: 'var(--bg-primary)',
            padding: '24px'
          }}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
      </div>
      
      {/* 📱 OVERLAY MOBILE */}
      {sidebarExpanded && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarExpanded(false)}
        />
      )}
      
    </div>
  );
};

export default Layout;