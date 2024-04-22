import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from './Regions';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import Strings from './Strings';
import LanguageContext from './LanguageContext';
import BackButton from './Components/BackBtn';


function RegionComponent() {
  const { regionId } = useParams();
  const { language } = useContext(LanguageContext);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const q = query(collection(db, `Regions/${regionId}/Stores`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newStores = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setStores(newStores);
    });

    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, [regionId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stores in {regionId}</h1>
      {stores.map((store) => (
        <Link to={`/store/${store.id}`} key={store.id}>
          <div className="mb-6 border p-4 rounded-xl shadow" 
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`, 
          backgroundSize: 'cover' }}>
            <h2 className="text-xl font-semibold">{store.StoreName}</h2>
            <p className="mt-2"><span className="font-bold">Location:</span> {store.Location}</p>
            <p className="mt-2"><span className="font-bold">Opening Hours:</span> {store['Opening hours']}</p>
            <p className="mt-2"><span className="font-bold">Closing Hours:</span> {store['Closing Hours']}</p>
          </div>
        </Link>
      ))}
      <BackButton />
    </div>
  );
}

export default RegionComponent;