import { atom } from 'nanostores';
import type { CourseCardProps } from '../types/Course';

export const classesStore = atom<CourseCardProps[]>([]);
export const isLoading = atom<boolean>(false);
export const errorStore = atom<string | null>(null);

let isInitialized = false;

export const fetchClasses = async () => {
  if (isInitialized) return;

  isLoading.set(true);
  errorStore.set(null);

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockClasses: CourseCardProps[] = [
      // 6:00 PM Row
      {
        id: '1',
        name: "🎵 Salsa Básica",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Lunes",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Básico",
        price: 10,
      },
      {
        id: '2',
        name: "💃 Bachata Sensual",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Martes",
        time: "6:00 PM",
        location: "Ritmo Vivo",
        genre: "Bachata",
        level: "Básico",
        price: 10,
      },
      {
        id: '3',
        name: "🔥 Merengue",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "orange",
        day: "Miércoles",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Merengue",
        level: "Básico",
        price: 10,
      },
      {
        id: '4',
        name: "🎵 Salsa Intermedia",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Jueves",
        time: "6:00 PM",
        location: "Ritmo Vivo",
        genre: "Salsa",
        level: "Intermedio",
        price: 10,
      },
      {
        id: '5',
        name: "💃 Bachata Básica",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Viernes",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Básico",
        price: 10,
      },

      // 7:00 PM Row
      {
        id: '6',
        name: "💚 Kizomba",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "green",
        day: "Lunes",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Kizomba",
        level: "Básico",
        price: 10,
      },
      {
        id: '7',
        name: "🎵 Salsa Avanzada",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Martes",
        time: "7:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Avanzado",
        price: 10,
      },
      {
        id: '8',
        name: "🎭 Tango",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "blue",
        day: "Miércoles",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Tango",
        level: "Básico",
        price: 10,
      },
      {
        id: '9',
        name: "💃 Bachata Intermedia",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Jueves",
        time: "7:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Intermedio",
        price: 10,
      },
      {
        id: '10',
        name: "🎵 Salsa Casino",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Viernes",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Salsa",
        level: "Intermedio",
        price: 10,
      },

      // 8:00 PM Row
      {
        id: '11',
        name: "💃 Bachata Avanzada",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Lunes",
        time: "8:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Avanzado",
        price: 10,
      },
      {
        id: '12',
        name: "🔥 Merengue Avanzado",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "orange",
        day: "Martes",
        time: "8:00 PM",
        location: "Ritmo Vivo",
        genre: "Merengue",
        level: "Avanzado",
        price: 10,
      },
      {
        id: '13',
        name: "🎵 Salsa en Línea",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Miércoles",
        time: "8:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Avanzado",
        price: 10,
      },
      {
        id: '14',
        name: "💚 Kizomba Avanzado",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "green",
        day: "Jueves",
        time: "8:00 PM",
        location: "Ritmo Vivo",
        genre: "Kizomba",
        level: "Avanzado",
        price: 10,
      },
      {
        id: '15',
        name: "🔥 Clase Libre",
        instructor: "Todos los profesores",
        duration: "⏱️ 120 min",
        color: "special",
        day: "Viernes",
        time: "8:00 PM",
        buttonText: "¡Únete!",
        location: "Social Club",
        genre: "Mix",
        level: "Todos",
        price: 10,
      }
    ];

    classesStore.set(mockClasses);
    isInitialized = true;
  } catch (err) {
    errorStore.set(err instanceof Error ? err.message : "Error loading classes");
  } finally {
    isLoading.set(false);
  }
};
