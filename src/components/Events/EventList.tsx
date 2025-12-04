import React, { useEffect, useState } from "react";
import Card from "../UI/Card";

interface Event {
    image: string;
    badge?: {
        text: string;
        colorClass: string;
    };
    date: string;
    title: string;
    description: string;
    location: string;
    price: string;
    priceClass?: string;
    buttonClass?: string;
    reserveLink: string;
    calendarLink: string;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // TODO: Replace with your actual API endpoint
                const API_URL = "https://api.example.com/events";

                // Simulating API call for demonstration
                // Remove this setTimeout and uncomment the fetch when you have the real API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data to simulate API response
                const mockData: Event[] = [
                    {
                        image: "images/salsa-tropical.jpg",
                        badge: { text: "🌴 TEMÁTICA", colorClass: "bg-green-600" },
                        date: "Viernes 22 Nov • 8:00 PM",
                        title: "Fiesta Tropical 🌴",
                        description:
                            "Ven vestido temático. Premios para los mejores outfits tropicales.",
                        location: "Social Club",
                        price: "$30.000",
                        priceClass: "text-sc-orange",
                        buttonClass: "gradient-bg",
                        reserveLink: "https://wa.me/573XXXXXXXXX",
                        calendarLink:
                            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Fiesta+Tropical&dates=20251122T200000/20251123T030000&details=Ven+vestido+temático.+Premios+para+los+mejores+outfits+tropicales.+Cover:+$30.000&location=Social+Club,+Aguacatala,+Medellín&sf=true&output=xml",
                    },
                    {
                        image: "musica-vivo.jpg",
                        badge: { text: "🎤 MÚSICA EN VIVO", colorClass: "bg-red-600" },
                        date: "Viernes 29 Nov • 9:00 PM",
                        title: "Orquesta en Vivo 🎺",
                        description: "Banda en vivo tocando los mejores clásicos de la salsa.",
                        location: "Ritmo Vivo",
                        price: "$35.000",
                        priceClass: "text-rv-aqua",
                        buttonClass: "bg-rv-aqua",
                        reserveLink: "https://wa.me/573XXXXXXXXX",
                        calendarLink:
                            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Orquesta+en+Vivo&dates=20251129T210000/20251130T030000&details=Banda+en+vivo+tocando+los+mejores+clásicos+de+la+salsa.+Cover:+$35.000&location=Ritmo+Vivo,+Medellín&sf=true&output=xml",
                    },
                    {
                        image: "ellas.jpg",
                        badge: { text: "👠 LADIES NIGHT", colorClass: "bg-pink-600" },
                        date: "Viernes 6 Dic • 9:00 PM",
                        title: "Noche de Ellas 💃",
                        description:
                            "Entrada gratis para ellas antes de las 11 PM. ¡Tragos especiales!",
                        location: "Social Club",
                        price: "GRATIS 👩",
                        priceClass: "text-pink-600",
                        buttonClass: "bg-pink-600",
                        reserveLink: "https://wa.me/573XXXXXXXXX",
                        calendarLink:
                            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Noche+de+Ellas+-+Ladies+Night&dates=20251206T210000/20251207T030000&details=Entrada+gratis+para+ellas+antes+de+las+11+PM.+Tragos+especiales.&location=Social+Club,+Aguacatala,+Medellín&sf=true&output=xml",
                    },
                ];

                // Uncomment this when you have the real API
                // const response = await fetch(API_URL);
                // if (!response.ok) {
                //   throw new Error("Failed to fetch events");
                // }
                // const data = await response.json();
                // setEvents(data);

                setEvents(mockData);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sc-orange"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600">
                <p>Error loading events: {error}</p>
            </div>
        );
    }

    return (
        <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
                <Card key={index} {...event} />
            ))}
        </div>
    );
};

export default EventList;
