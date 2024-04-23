import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './Regions';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import BackButton from './Components/BackBtn';

function StoreComponent() {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'Employees'), where('StoreID', '==', storeId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEmployees = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setEmployees(newEmployees);
    });

    return () => unsubscribe();
  }, [storeId]);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleConfirmClick = () => {
    navigate(`/services/${selectedEmployee.id}`);
  };

  return (
    <main className="flex flex-col justify-between min-h-screen">
      <body className="p-6 grid grid-cols-3 gap-4">
        {employees.map((employee) => (
          <div key={employee.id} className="flex flex-col items-center justify-center" onClick={() => handleEmployeeClick(employee)}>
            <img src={employee.ProfileImg} alt={employee.EmployeeName} className="rounded-full w-20 h-20 bg-transparent object-cover shadow-md shadow-gray-800" />
            <div className="my-2 font-mono font-bold shadow-gray-800">{employee.EmployeeName}</div>
          </div>
        ))}
        {selectedEmployee && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg">
              <p className="text-lg font-semibold mb-4">Do you want to select {selectedEmployee.EmployeeName}?</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="px-4 py-2 rounded text-red-500 font-mono tracking-normal font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClick}
                  className="px-4 py-2 rounded text-white tracking-normal font-mono font-bold text-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </body>
      <footer>
        {!selectedEmployee && <BackButton />}
      </footer>
    </main>
  );
}

export default StoreComponent;