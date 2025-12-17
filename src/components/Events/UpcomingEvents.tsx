import React, { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { eventsStore, fetchEvents, isLoading } from "../../stores/eventsStore";
import Card from "../UI/Card";

const UpcomingEvents: React.FC = () => {
    const events = useStore(eventsStore);
    const loading = useStore(isLoading);

    useEffect(() => {
        fetchEvents();
    }, []);

    // Filter future events and sort by date
    const now = new Date();
    const upcoming = [...events]
        .filter(event => new Date(event.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);

    if (loading && events.length === 0) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
            </div>
        );
    }

    if (upcoming.length === 0 && !loading) {
        return (
            <div className="text-center py-12 text-gray-500">
                No hay eventos próximos programados.
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {upcoming.map((event, index) => (
                <Card key={index} {...event} />
            ))}
        </div>
    );
};

export default UpcomingEvents;
