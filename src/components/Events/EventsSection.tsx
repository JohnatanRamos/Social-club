import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import {
    eventsStore,
    isLoading,
    errorStore,
    fetchEvents,
} from "../../stores/eventsStore";
import type { Event } from "../../types/Event";
import Card from "../UI/Card";
import { formatDate, formatGoogleCalendarDate } from "../../utils/dateUtils";

const colorMap = {
    orange: { text: "text-sc-orange", btn: "gradient-bg", bg: "bg-orange-50" },
    blue: { text: "text-rv-aqua", btn: "bg-rv-aqua", bg: "bg-cyan-50" },
    pink: { text: "text-pink-600", btn: "bg-pink-600", bg: "bg-pink-50" },
    green: { text: "text-green-600", btn: "bg-green-600", bg: "bg-green-50" },
};

const getStyles = (color: string) => {
    return colorMap[color as keyof typeof colorMap] || colorMap.orange;
};

const EventsSection: React.FC = () => {
    // Subscribe to global store
    const events = useStore(eventsStore);
    const loading = useStore(isLoading);
    const error = useStore(errorStore);

    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

    // Filter states
    const [selectedLocation, setSelectedLocation] = useState("Todas las sedes");
    const [selectedType, setSelectedType] = useState("Todos los tipos");
    const [selectedMonth, setSelectedMonth] = useState("Todos los meses");

    // Fetch events on mount (if not already fetched)
    useEffect(() => {
        fetchEvents();
    }, []);

    // Update filtered events when events or filters change
    useEffect(() => {
        let result = events;

        if (selectedLocation !== "Todas las sedes") {
            result = result.filter((event) => event.location === selectedLocation);
        }
        if (selectedType !== "Todos los tipos") {
            result = result.filter((event) => event.type === selectedType);
        }
        if (selectedMonth !== "Todos los meses") {
            result = result.filter((event) => event.month === selectedMonth);
        }

        setFilteredEvents(result);
    }, [selectedLocation, selectedType, selectedMonth, events]);

    return (
        <>
            {/* Filters Section */}
            <section
                className="py-8 mt-8 bg-white shadow-sm z-40 w-[97%]"
                style={{ margin: "10px auto" }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📍 Sede
                            </label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                            >
                                <option>Todas las sedes</option>
                                <option>Social Club</option>
                                <option>Ritmo Vivo</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                🎭 Tipo de Evento
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                            >
                                <option>Todos los tipos</option>
                                <option>Fiestas Temáticas</option>
                                <option>Workshops</option>
                                <option>Shows en Vivo</option>
                                <option>Competencias</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                📅 Mes
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="bg-gray-100 w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-sc-orange focus:outline-none"
                            >
                                <option>Todos los meses</option>
                                <option>Noviembre 2025</option>
                                <option>Diciembre 2025</option>
                                <option>Enero 2026</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            {events.filter(e => e.featuredEvents).length > 0 && (
                <section className="py-12 bg-linear-to-br from-orange-50 to-red-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-4xl">🔥</span>
                            <h3 className="text-3xl font-bold text-gray-800">Eventos Destacados</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {events
                                .filter((event) => event.featuredEvents)
                                .map((event, index) => {
                                    const styles = getStyles(event.color);
                                    return (
                                        <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-xl hover-lift">
                                            <div className="relative">
                                                <img
                                                    src={event.image}
                                                    alt={event.title}
                                                    className="w-full h-64 object-cover"
                                                />
                                                {/* Optional: Add a badge if we had a way to calculate days remaining */}
                                                <div
                                                    className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-full backdrop-blur-sm"
                                                >
                                                    ✨ Destacado
                                                </div>
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                    <span>📅 {event.day} {formatDate(event.date)} ⏰ {event.time}</span>
                                                </div>
                                                <h4 className="text-3xl font-bold mb-3 text-gray-800">
                                                    {event.title}
                                                </h4>
                                                <p className="text-gray-600 mb-4 leading-relaxed">
                                                    {event.description}
                                                </p>

                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                    <div className={`${styles.bg} rounded-xl p-4`}>
                                                        <div className="text-sm text-gray-600 mb-1">Ubicación</div>
                                                        <div className="font-bold text-gray-800">📍 {event.location}</div>
                                                    </div>
                                                    <div className={`${styles.bg} rounded-xl p-4`}>
                                                        <div className="text-sm text-gray-600 mb-1">Cover</div>
                                                        <div className={`font-bold text-xl ${styles.text}`}>
                                                            {event.price === 0 ? "Gratis" : `$${event.price.toLocaleString()}`}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mb-3">
                                                    <a
                                                        href={`https://wa.me/573218903991?text=Hola%2C%20quiero%20reservar%20para%20${encodeURIComponent(event.title)}`}
                                                        className={`flex-1 text-white text-center py-3 rounded-xl font-semibold hover:shadow-lg transition ${styles.btn}`}
                                                    >
                                                        {event.type === "Workshops" ? "Inscribirme Ahora" : "Reservar Mesa"}
                                                    </a>
                                                </div>
                                                <a
                                                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${encodeURIComponent(formatGoogleCalendarDate(event.date))}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&sf=true&output=xml`}
                                                    target="_blank"
                                                    className="block w-full text-center py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
                                                >
                                                    📅 Agregar a Google Calendar
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </section>
            )}

            {/* Events Grid Section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8">
                        Todos los Eventos
                    </h3>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-600">
                            <p>Error loading events: {error}</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((event, index) => (
                                    <Card key={index} {...event} />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-12 text-gray-500">
                                    No se encontraron eventos con estos filtros.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default EventsSection;
