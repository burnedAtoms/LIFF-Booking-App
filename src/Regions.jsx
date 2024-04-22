import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLessThan } from 'react-icons/fa';

const Regions = () => {
  const navigate = useNavigate();
  const regions = ['Taipei', 'Taichung', 'Tainan', 'Kaohsiung', 'Hsinchu', 'Yilan', 'Hualien', 'Taitung', 'Pingtung', 'Miaoli', 'Changhua', 'Nantou', 'Yunlin', 'Chiayi', 'Penghu', 'Kinmen', 'Lienchiang'];

  return (
    <div className="Regions flex flex-col justify-between min-h-screen items-start max-w-md mx-auto">
      <h1 className="text-3xl px-4 font-bold text-gray-600 mb-4">Regions</h1>
      <p className="px-4">Setup regions on firebase.</p>
      <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded flex items-center absolute bottom-0 left-0">
        <FaLessThan /> <span className="px-1">Back</span>
      </button>
    </div>
  );
};

export default Regions;