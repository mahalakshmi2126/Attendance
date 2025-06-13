import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classNames from 'classnames';
import { FaCalendarAlt } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

const AdminEmployeeAttendanceModal = ({ employee, onClose }) => {
    const [monthlySummary, setMonthlySummary] = useState(null);
    const [monthlySummaryLoading, setMonthlySummaryLoading] = useState(true);
    const [monthlySummaryError, setMonthlySummaryError] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [dateStatusList, setDateStatusList] = useState([]);
    const [showCalendarModal, setShowCalendarModal] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (dateStatusList.length > 0) {
            const counts = dateStatusList.reduce((acc, curr) => {
                const status = curr.status;
                if (status) {
                    acc[status] = (acc[status] || 0) + 1;
                }
                return acc;
            }, {});
            setMonthlySummary(counts);
        }
    }, [dateStatusList]);

    useEffect(() => {
        if (employee && employee._id && selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            fetchMonthlySummary(employee._id, year, month);
        }
    }, [employee, selectedDate]);

    const fetchMonthlySummary = async (employeeId, year, month) => {
        try {
            setMonthlySummaryLoading(true);
            const res = await axios.get(
                `http://localhost:5000/api/attendance/monthly-summary/${employeeId}/${year}/${month}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const daily = Array.isArray(res.data.dailyRecords) ? res.data.dailyRecords : [];

            const counts = daily.reduce((acc, curr) => {
                const status = curr.status;
                if (status) {
                    acc[status] = (acc[status] || 0) + 1;
                }
                return acc;
            }, {});

            setMonthlySummary(counts);
            setDateStatusList(daily);
            setMonthlySummaryError('');
        } catch (error) {
            console.error(error);
            setMonthlySummaryError('Failed to load monthly summary');
        } finally {
            setMonthlySummaryLoading(false);
        }
    };


    const handleDateChange = (date) => {
        // Reserved for future use if clicking on a date is needed
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center px-4">
            <div className="bg-white/30 rounded-lg p-6 w-full max-w-3xl relative text-white">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white hover:text-black"
                >
                    <X />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    Attendance Summary – {employee.fullName}
                </h2>

                <div className="space-y-6">
                    {/* Monthly Attendance */}
                    <div className="bg-white p-4 rounded-xl shadow-inner">
                        <div className="flex justify-between items-center mb-2 text-black">
                            <p className="text-lg font-semibold">Monthly Attendance</p>
                            <button
                                onClick={() => setShowCalendarModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                <FaCalendarAlt />
                                Open Calendar
                            </button>
                        </div>



                        {monthlySummaryLoading ? (
                            <p className="text-sm italic text-white">Loading summary...</p>
                        ) : monthlySummaryError ? (
                            <p className="text-sm italic text-red-400">Error: {monthlySummaryError}</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-white">
                                <div className="bg-green-600 p-3 rounded">
                                    <p className="font-semibold">Present</p>
                                    <p className="text-xl font-bold">{monthlySummary.Present || 0}</p>
                                </div>
                                <div className="bg-red-600 p-3 rounded">
                                    <p className="font-semibold">Absent</p>
                                    <p className="text-xl font-bold">{monthlySummary.Absent || 0}</p>
                                </div>
                                <div className="bg-yellow-400 p-3 rounded text-black">
                                    <p className="font-semibold">Half Day</p>
                                    <p className="text-xl font-bold">{monthlySummary['Half Day'] || 0}</p>
                                </div>
                                <div className="bg-blue-500 p-3 rounded">
                                    <p className="font-semibold">Leave</p>
                                    <p className="text-xl font-bold">{monthlySummary.Leave || 0}</p>
                                </div>
                                <div className="bg-purple-600 p-3 rounded">
                                    <p className="font-semibold">Permission</p>
                                    <p className="text-xl font-bold">{monthlySummary.Permission || 0}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Calendar Modal */}
                {showCalendarModal && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 50, opacity: 0 }}
                                transition={{ duration: 0.4, ease: 'easeInOut' }}
                                className="bg-white/30 rounded-2xl p-6 shadow-2xl w-80 relative"
                            >
                                <button
                                    onClick={() => setShowCalendarModal(false)}
                                    className="absolute top-2 right-3 text-2xl font-bold text-white hover:text-black transition"
                                >
                                    &times;
                                </button>

                                <h2 className="text-xl font-bold text-center mb-4 text-white">
                                    📅 Monthly Attendance Calendar
                                </h2>

                                {/* Month & Year Dropdowns */}
                                <div className="flex justify-center items-center gap-4 mb-4">
                                    <select
                                        value={selectedDate.getMonth()}
                                        onChange={(e) => {
                                            const updated = new Date(selectedDate);
                                            updated.setMonth(parseInt(e.target.value));
                                            setSelectedDate(updated);
                                            fetchMonthlySummary(employee._id, updated.getFullYear(), String(updated.getMonth() + 1).padStart(2, '0'));
                                        }}
                                        className="appearance-none bg-white text-black font-medium py-1 px-3 rounded"
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>
                                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedDate.getFullYear()}
                                        onChange={(e) => {
                                            const updated = new Date(selectedDate);
                                            updated.setFullYear(parseInt(e.target.value));
                                            setSelectedDate(updated);
                                            fetchMonthlySummary(employee._id, updated.getFullYear(), String(updated.getMonth() + 1).padStart(2, '0'));
                                        }}
                                        className="appearance-none bg-white text-black font-medium py-1 px-3 rounded"
                                    >
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {/* Date Picker with colored days */}
                                <DatePicker
                                    inline
                                    renderCustomHeader={() => null}
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        const todayStr = new Date().toISOString().split('T')[0];
                                        const clickedStr = date.toISOString().split('T')[0];
                                        if (clickedStr !== todayStr) return;
                                        handleDateChange(date);
                                        setShowCalendarModal(false);
                                    }}
                                    maxDate={new Date()}
                                    dayClassName={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        const dateCopy = new Date(date);
                                        dateCopy.setHours(0, 0, 0, 0);

                                        const formatted = date.toISOString().split('T')[0];
                                        const status = dateStatusList.find((d) => d.date === formatted)?.status;

                                        const isToday = dateCopy.getTime() === today.getTime();
                                        const isFuture = dateCopy.getTime() > today.getTime();
                                        const isPast = dateCopy.getTime() < today.getTime();

                                        const baseClass = 'rounded-full font-semibold text-center';
                                        const statusClass =
                                            status === 'Present'
                                                ? 'bg-green-400 text-white pointer-events-none'
                                                : status === 'Absent'
                                                    ? 'bg-red-400 text-white pointer-events-none'
                                                    : status === 'Half Day'
                                                        ? 'bg-yellow-300 text-black pointer-events-none'
                                                        : status === 'Leave'
                                                            ? 'bg-blue-400 text-white pointer-events-none'
                                                            : status === 'Permission'
                                                                ? 'bg-purple-400 text-white pointer-events-none'
                                                                : '';

                                        const todayHighlight = isToday ? 'ring-2 ring-white' : '';
                                        const futureDisable = isFuture ? 'pointer-events-none opacity-40' : '';
                                        const pastBlack = isPast && !status ? 'text-black pointer-events-none' : '';

                                        return classNames(baseClass, statusClass, todayHighlight, futureDisable, pastBlack);
                                    }}
                                />
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default AdminEmployeeAttendanceModal;