import React from 'react';
import { useStore } from '@nanostores/react';
import { filtersStore, setFilter } from '../../stores/scheduleFiltersStore';
import { classesStore } from '../../stores/classesStore';

export const ScheduleFilters: React.FC = () => {
    const filters = useStore(filtersStore);
    const classes = useStore(classesStore);

    const handleChange = (key: keyof typeof filters, value: string) => {
        setFilter(key, value);
    };

    // Derived filter options
    const genres = ["Todos los géneros", ...new Set(classes.map(c => c.genre).filter(Boolean) as string[])];
    const levels = ["Todos los niveles", ...new Set(classes.map(c => c.level).filter(Boolean) as string[])];
    const locations = ["Todas las sedes", ...new Set(classes.map(c => c.location).filter(Boolean) as string[])];
    const instructors = ["Todos los profesores", ...new Set(classes.map(c => c.instructor).filter(Boolean) as string[])];
    const days = ["Todos los días", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    return (
        <section
            className="py-8 pt-2 bg-white shadow-sm z-40 w-[97%]"
            style={{ margin: "0 auto" }}
        >
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-5 gap-4">
                    {/* Sede Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📍 Sede
                        </label>
                        <select
                            value={filters.location}
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    {/* Genre Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            🎵 Género
                        </label>
                        <select
                            value={filters.genre}
                            onChange={(e) => handleChange('genre', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            {genres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📊 Nivel
                        </label>
                        <select
                            value={filters.level}
                            onChange={(e) => handleChange('level', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Day Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            📆 Día
                        </label>
                        <select
                            value={filters.day}
                            onChange={(e) => handleChange('day', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            {days.map(day => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                    </div>

                    {/* Professor Filter */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            👨‍🏫 Profesor
                        </label>
                        <select
                            value={filters.instructor}
                            onChange={(e) => handleChange('instructor', e.target.value)}
                            className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                        >
                            {instructors.map(ins => (
                                <option key={ins} value={ins}>{ins}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </section>
    );
};
