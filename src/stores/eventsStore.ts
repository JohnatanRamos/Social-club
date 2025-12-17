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
    const API_URL = "http://72.60.114.240:3000/events";

    // Simulating API call
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    // const mockData: Event[] = [
    //   {
    //     image: "images/salsa-tropical.jpg",
    //     date: "Viernes 22 Nov • 8:00 PM",
    //     title: "Fiesta Tropical 🌴",
    //     description:
    //       "Ven vestido temático. Premios para los mejores outfits tropicales.",
    //     location: "Social Club",
    //     price: 30000,
    //     color: "text-sc-orange",
    //     buttonClass: "gradient-bg",
    //     type: "Fiestas Temáticas",
    //     month: "Noviembre 2025",
    //     isFree: false,
    //   },
    //   {
    //     image: "musica-vivo.jpg",
    //     date: "Viernes 29 Nov • 9:00 PM",
    //     title: "Orquesta en Vivo 🎺",
    //     description:
    //       "Banda en vivo tocando los mejores clásicos de la salsa.",
    //     location: "Ritmo Vivo",
    //     price: 35000,
    //     color: "text-rv-aqua",
    //     buttonClass: "bg-rv-aqua",
    //     type: "Shows en Vivo",
    //     month: "Noviembre 2025",
    //     isFree: false,
    //   },
    //   {
    //     image: "ellas.jpg",
    //     date: "Viernes 6 Dic • 9:00 PM",
    //     title: "Noche de Ellas 💃",
    //     description:
    //       "Entrada gratis para ellas antes de las 11 PM. ¡Tragos especiales!",
    //     location: "Social Club",
    //     price: 0,
    //     color: "text-pink-600",
    //     buttonClass: "bg-pink-600",
    //     type: "Fiestas Temáticas",
    //     isFree: true,
    //     month: "Diciembre 2025",
    //   },
    // ];

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