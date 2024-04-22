import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Regions from './Regions';
import RegionComponent from './RegionComponent';
import StoreComponent from './StoreComponent';
import LanguageContext from './LanguageContext';
import Strings from './Strings';
import liff from '@line/liff';

function App() {
  const [language, setLanguage] = useState('en');
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
  };

  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(() => {
        setMessage("LIFF init succeeded.");
      })
      .catch((e) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <div className="App flex flex-col items-center max-w-md mx-auto">
          <Routes>
            <Route exact path="/" element={
              <>
                <header className="flex w-full flex-col items-center px-4 py-8">
                  <div className="flex flex-col sm:flex-row items-center w-full">
                    <h1 className="text-3xl px-4 font-bold text-gray-600 mb-4 sm:mb-0">Example Salon</h1>
                    <select
                      value={language}
                      onChange={handleLanguageChange}
                      className="mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out w-full"
                    >
                      <option value="en">{Strings[language].english}</option>
                      <option value="zh">{Strings[language].chinese}</option>
                    </select>
                  </div>
                  <p className="mt-4">{Strings[language].businessInfo}</p>
                </header>
                <footer className="w-full fixed bottom-0 px-4 py-2">
                  <Link to="/regions" className="w-full bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded block text-center">
                    {Strings[language].makeReservation}
                  </Link>
                </footer>
              </>
            } />
            <Route path="/regions" element={<Regions />} />
            <Route path="/region/:regionId" element={<RegionComponent />} />
            <Route path="/store/:storeId" element={<StoreComponent />} />
          </Routes>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;