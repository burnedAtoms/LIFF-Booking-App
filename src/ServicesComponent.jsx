import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './Regions';
import { doc, getDoc } from 'firebase/firestore';
import BackButton from './Components/BackBtn';
import { AiOutlinePlus } from 'react-icons/ai';

function ServicesComponent() {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      const employeeDoc = await getDoc(doc(db, 'Employees', employeeId));
      if (employeeDoc.exists()) {
        setEmployee(employeeDoc.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchEmployee();
  }, [employeeId]);

  if (!employee) {
    return <div>Loading...</div>;
  }

  return (
    <body className=" p-6 flex flex-col">
      <h1 className="mt-6 mb-12 text-2xl text-slate-500 font-bold">Services offered by {employee.EmployeeName}</h1>
      {employee.Services.map((service, index) => (
        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg shadow-sm mb-4"
          onClick={() => navigate('/BookingCalendar', { state: { duration: service.ServiceDurationHours, employeeId: employeeId } })}>
          <div className="flex w-full justify-between font-mono font-semibold text-gray-500">
            <span className="flex flex-wrap max-w-[calc(50%)]">{service.ServiceName}</span>
            <div className="flex flex-col items-end">
              <div className="flex items-center text-blue-400">
                ${service.Price} NTD
                <AiOutlinePlus className="ml-2 text-green-500" />
              </div>
              <div className="text-sm font-thin tracking-wider text-gray-500">Duration: {service.ServiceDurationHours} Hours</div>
            </div>
          </div>
        </div>
      ))}
    </body>
  );
}

export default ServicesComponent;