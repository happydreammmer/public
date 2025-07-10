import React from 'react';
// import ThemeSwitcher from './ThemeSwitcher'; // ThemeSwitcher removed

// interface HeaderProps { // Props removed as theme is fixed
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// }

const Header: React.FC = (/*{ theme, toggleTheme }*/) => { // Props removed
  return (
    <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white p-4 shadow-md shadow-slate-800/50 sticky top-0 z-20 flex-shrink-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5Z" />
          </svg>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">OSEE</h1>
        </div>
        {/* <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} /> ThemeSwitcher removed */}
      </div>
    </header>
  );
};

export default Header;