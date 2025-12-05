import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { classesStore, isLoading, errorStore, fetchClasses } from '../../stores/classesStore';
import { ClassCard } from '../UI/ClassCard';

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const TIME_SLOTS = ["6:00 PM", "7:00 PM", "8:00 PM"];

export const Schedule: React.FC = () => {
    const classes = useStore(classesStore);
    const loading = useStore(isLoading);
    const error = useStore(errorStore);

    useEffect(() => {
        fetchClasses();
    }, []);

    if (loading && classes.length === 0) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10 text-red-600">
                <p>Error cargando los horarios: {error}</p>
                <button
                    onClick={() => fetchClasses()}
                    className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    const getClassForSlot = (day: string, time: string) => {
        return classes.find(c => c.day === day && c.time === time);
    };

    return (
        <div>
            {/* Desktop Schedule Table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-lg">
                <table className="w-full">
                    <thead className="bg-linear-to-br from-[#f05123] to-[#ff6b3d] text-white">
                        <tr>
                            <th className="py-4 px-6 text-left">HORARIO</th>
                            {DAYS.map(day => (
                                <th key={day} className="py-4 px-6 text-center uppercase">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {TIME_SLOTS.map((time) => (
                            <tr key={time} className="border-b border-gray-100 last:border-0">
                                <td className="py-4 px-6 font-bold text-gray-700">{time}</td>
                                {DAYS.map((day) => {
                                    const classSession = getClassForSlot(day, time);
                                    return (
                                        <td key={`${day}-${time}`} className="py-4 px-6 min-w-[200px]">
                                            {classSession ? (
                                                <ClassCard
                                                    title={classSession.title}
                                                    instructor={classSession.instructor}
                                                    duration={classSession.duration}
                                                    color={classSession.color}
                                                    buttonText={classSession.buttonText}
                                                />
                                            ) : (
                                                <div className="h-full min-h-[140px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm">
                                                    Sin clase
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Schedule Cards */}
            <div className="md:hidden space-y-4">
                {classes.map((classSession) => (
                    <div key={classSession.id} className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-lg">{classSession.day} {classSession.time}</h4>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${classSession.color === 'red' ? 'bg-red-100 text-red-700' :
                                classSession.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                                    classSession.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                                        classSession.color === 'green' ? 'bg-green-100 text-green-700' :
                                            classSession.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                                'bg-linear-to-r from-red-100 to-purple-100 text-purple-700'
                                }`}>
                                {classSession.title.split(' ')[1] || 'Clase'}
                            </span>
                        </div>
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>👨‍🏫</span>
                                <span>{classSession.instructor}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>⏱️</span>
                                <span>{classSession.duration}</span>
                            </div>
                        </div>
                        <button className="w-full gradient-bg text-white py-3 rounded-xl font-semibold hover:shadow-lg transition">
                            {classSession.buttonText || "Reservar Clase"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
