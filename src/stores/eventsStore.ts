import { atom } from 'nanostores';
import type { Event } from '../types/Event';

const eventsStore = atom<Event[]>([]);
const isLoading = atom<boolean>(false);
const errorStore = atom<string | null>(null);

// Cache flag to prevent re-fetching if data is already there
let isInitialized = false;

const fetchEvents = async () => {
  // If we already have data, don't fetch again (unless we want to force refresh)
  if (isInitialized) return;

  isLoading.set(true);
  errorStore.set(null);

  try {
    // TODO: Replace with your actual API endpoint
    // const API_URL = "https://api.example.com/events";
    
    // Simulating API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
        type: "Fiestas Temáticas",
        month: "Noviembre 2025",
      },
      {
        image: "musica-vivo.jpg",
        badge: { text: "🎤 MÚSICA EN VIVO", colorClass: "bg-red-600" },
        date: "Viernes 29 Nov • 9:00 PM",
        title: "Orquesta en Vivo 🎺",
        description:
          "Banda en vivo tocando los mejores clásicos de la salsa.",
        location: "Ritmo Vivo",
        price: "$35.000",
        priceClass: "text-rv-aqua",
        buttonClass: "bg-rv-aqua",
        reserveLink: "https://wa.me/573XXXXXXXXX",
        calendarLink:
          "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Orquesta+en+Vivo&dates=20251129T210000/20251130T030000&details=Banda+en+vivo+tocando+los+mejores+clásicos+de+la+salsa.+Cover:+$35.000&location=Ritmo+Vivo,+Medellín&sf=true&output=xml",
        type: "Shows en Vivo",
        month: "Noviembre 2025",
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
        type: "Fiestas Temáticas",
        month: "Diciembre 2025",
      },
    ];

    // Uncomment this when you have the real API
    // const response = await fetch(API_URL);
    // if (!response.ok) throw new Error("Failed to fetch events");
    // const data = await response.json();
    // eventsStore.set(data);
    
    eventsStore.set(mockData);
    isInitialized = true;
  } catch (err) {
    errorStore.set(err instanceof Error ? err.message : "An error occurred");
  } finally {
    isLoading.set(false);
  }
};


export { eventsStore, isLoading, errorStore, fetchEvents };