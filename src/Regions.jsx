import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore, onSnapshot, query } from 'firebase/firestore';
import Strings from './Strings';
import LanguageContext from './LanguageContext';
import BackButton from './Components/BackBtn';
import { FaGreaterThan } from 'react-icons/fa';


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

const Regions = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState([]);
  const { language, setLanguage } = useContext(LanguageContext);

  useEffect(() => {
    const q = query(collection(db, "Regions"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const regions = [];
      querySnapshot.forEach((doc) => {
        regions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setRegions(regions);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className="flex flex-col justify-between min-h-screen w-full">
      <body className="flex flex-col items-center w-full mx-auto px-8">
        <h1 className="text-3xl px-4 font-bold text-gray-600 mb-4">{Strings[language].regions}</h1>
        <ul className="w-full">
          {regions.map((region) => (
            <li key={region.id} onClick={() => navigate(`/region/${region.id}`)} className="flex justify-between items-center border p-4 mb-2 rounded shadow">
              <span>{region.id}</span>
              <FaGreaterThan />
            </li>
          ))}
        </ul>
      </body>
      <footer>
        <BackButton />
      </footer>
    </main>
  );
};

export default Regions;