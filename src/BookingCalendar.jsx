import React, { useState, useEffect } from 'react';
import BackButton from './Components/BackBtn';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { db } from './Regions';
import { useLocation } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import CustomCalendar from './Components/CustomCalendar';

function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [employee, setEmployee] = useState(null);
  const location = useLocation();
  const duration = location.state.duration;
  const employeeId = location.state.employeeId;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  useEffect(() => {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    const q = query(
      collection(db, 'Bookings'),
      where('EmployeeId', '==', employeeId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(newBookings);
    });

    return () => unsubscribe();
  }, [employeeId]);

  useEffect(() => {
    const fetchEmployee = async () => {
      const docRef = doc(db, 'Employees', employeeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmployee(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchEmployee();
  }, [employeeId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const endDate = new Date(date);
    endDate.setHours(endDate.getHours() + duration);
    console.log('End time:', endDate);
  };

  const isDayFull = (date) => {
    const count = bookings.filter(
      (booking) => booking.date.toDateString() === date.toDateString()
    ).length;
    return count >= 10;
  };
  

  const getDayStatus = (date) => {
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const dayOfWeek = date.toLocaleString('default', { weekday: 'long' });

    if (date > threeMonthsFromNow) {
      return 'unavailable';
    } else if (isDayFull(date)) {
      return 'full';
    } else if (employee && employee.WorkingDays.includes(dayOfWeek)) {
      return 'available';
    } else {
      return 'unavailable';
    }
  };

  const isSelectable = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set the time to 00:00:00.000
    const status = getDayStatus(date);
    return status === 'available' && date > today;
  };

  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <main>
        <h2 className="text-2xl font-bold mb-4 text-center">Selected Date and Time: {selectedDate.toLocaleString()}</h2>
      </main>
      <section>
        <CustomCalendar
          initialSelectedDate={selectedDate}
          selectedDate={selectedDate}
          handleDateChange={handleDateChange}
          isSelectable={isSelectable}
          dayStatus={getDayStatus}
        />
      </section>
      <footer>
        <BackButton />
      </footer>
    </div>
  );
}

export default BookingCalendar;