import React, { useContext } from 'react';
import { FaLessThan } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Strings from '../Strings';
import LanguageContext from '../LanguageContext';

const BackButton = () => {
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);

  return (
    <button onClick={() => navigate(-1)} className="mb-4 text-blue-500 hover:text-blue-700 font-bold py-2 px-4 rounded flex items-center absolute bottom-0 left-0">
      <FaLessThan /> <span className="px-1">{Strings[language].backBtnString}</span>
    </button>
  );
};

export default BackButton;