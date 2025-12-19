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
    const API_URL_DEV = "http://72.60.114.240:3000/events";
    const API_URL = "https://api.ritmovivosocialclub.com/events";

    // Simulating API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: Event[] = [
      {
        image: "ellas.jpg",
        date: new Date("2025-12-06T21:00:00"),
        day: "Martes",
        time: "21:00",
        title: "Noche de Ellos 🏆",
        description:
          "Entrada gratis para ellos antes de las 11 PM. ¡Tragos especiales!",
        location: "Social Club",
        price: 0,
        color: "pink",
        type: "Fiesta para ellos",
        isFree: true,
        month: "Diciembre 2025",
        featuredEvents: false,
      },
      {
        image: "images/salsa-tropical.jpg",
        date: new Date("2025-12-22T20:00:00"),
        day: "Jueves",
        time: "20:00",
        title: "Fiesta Tropical 🌴",
        description:
          "Ven vestido temático. Premios para los mejores outfits tropicales.",
        location: "Social Club",
        price: 30000,
        color: "orange",
        type: "Fiestas Temáticas",
        month: "Noviembre 2025",
        isFree: false,
        featuredEvents: true,
      },
      {
        image: "musica-vivo.jpg",
        date: new Date("2025-12-29T21:00:00"),
        day: "Viernes",
        time: "21:00",
        title: "Orquesta en Vivo 🎺",
        description:
          "Banda en vivo tocando los mejores clásicos de la salsa.",
        location: "Ritmo Vivo",
        price: 35000,
        color: "blue",
        type: "Shows en Vivo",
        month: "Noviembre 2025",
        isFree: false,
        featuredEvents: true,
      },
      {
        image: "ellas.jpg",
        date: new Date("2025-12-17T21:00:00"),
        day: "Martes",
        time: "21:00",
        title: "Noche de Ellas 💃",
        description:
          "Entrada gratis para ellas antes de las 11 PM. ¡Tragos especiales!",
        location: "Social Club",
        price: 0,
        color: "pink",
        type: "Fiestica",
        isFree: true,
        month: "Diciembre 2025",
        featuredEvents: false,
      },
    ];

    // Uncomment this when you have the real API
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();
    eventsStore.set(data);

    // eventsStore.set(mockData);
    isInitialized = true;
  } catch (err) {
    errorStore.set(err instanceof Error ? err.message : "An error occurred");
  } finally {
    isLoading.set(false);
  }
};


export { eventsStore, isLoading, errorStore, fetchEvents };