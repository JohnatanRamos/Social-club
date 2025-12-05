import { atom } from 'nanostores';

export interface ClassSession {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  color: "red" | "purple" | "orange" | "green" | "blue" | "special";
  day: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
  time: string; // e.g., "6:00 PM"
  buttonText?: string;
  location: "Social Club" | "Ritmo Vivo";
  genre: "Salsa" | "Bachata" | "Merengue" | "Kizomba" | "Tango" | "Mix";
  level: "Principiante" | "Básico" | "Intermedio" | "Avanzado" | "Todos";
}

export const classesStore = atom<ClassSession[]>([]);
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

    const mockClasses: ClassSession[] = [
      // 6:00 PM Row
      {
        id: '1',
        title: "🎵 Salsa Básica",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Lunes",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Básico"
      },
      {
        id: '2',
        title: "💃 Bachata Sensual",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Martes",
        time: "6:00 PM",
        location: "Ritmo Vivo",
        genre: "Bachata",
        level: "Básico"
      },
      {
        id: '3',
        title: "🔥 Merengue",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "orange",
        day: "Miércoles",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Merengue",
        level: "Básico"
      },
      {
        id: '4',
        title: "🎵 Salsa Intermedia",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Jueves",
        time: "6:00 PM",
        location: "Ritmo Vivo",
        genre: "Salsa",
        level: "Intermedio"
      },
      {
        id: '5',
        title: "💃 Bachata Básica",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Viernes",
        time: "6:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Básico"
      },

      // 7:00 PM Row
      {
        id: '6',
        title: "💚 Kizomba",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "green",
        day: "Lunes",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Kizomba",
        level: "Básico"
      },
      {
        id: '7',
        title: "🎵 Salsa Avanzada",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Martes",
        time: "7:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Avanzado"
      },
      {
        id: '8',
        title: "🎭 Tango",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "blue",
        day: "Miércoles",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Tango",
        level: "Básico"
      },
      {
        id: '9',
        title: "💃 Bachata Intermedia",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Jueves",
        time: "7:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Intermedio"
      },
      {
        id: '10',
        title: "🎵 Salsa Casino",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Viernes",
        time: "7:00 PM",
        location: "Ritmo Vivo",
        genre: "Salsa",
        level: "Intermedio"
      },

      // 8:00 PM Row
      {
        id: '11',
        title: "💃 Bachata Avanzada",
        instructor: "María González",
        duration: "⏱️ 60 min",
        color: "purple",
        day: "Lunes",
        time: "8:00 PM",
        location: "Social Club",
        genre: "Bachata",
        level: "Avanzado"
      },
      {
        id: '12',
        title: "🔥 Merengue Avanzado",
        instructor: "Carlos Rodríguez",
        duration: "⏱️ 60 min",
        color: "orange",
        day: "Martes",
        time: "8:00 PM",
        location: "Ritmo Vivo",
        genre: "Merengue",
        level: "Avanzado"
      },
      {
        id: '13',
        title: "🎵 Salsa en Línea",
        instructor: "Juan Pérez",
        duration: "⏱️ 60 min",
        color: "red",
        day: "Miércoles",
        time: "8:00 PM",
        location: "Social Club",
        genre: "Salsa",
        level: "Avanzado"
      },
      {
        id: '14',
        title: "💚 Kizomba Avanzado",
        instructor: "Ana Martínez",
        duration: "⏱️ 60 min",
        color: "green",
        day: "Jueves",
        time: "8:00 PM",
        location: "Ritmo Vivo",
        genre: "Kizomba",
        level: "Avanzado"
      },
      {
        id: '15',
        title: "🔥 Clase Libre",
        instructor: "Todos los profesores",
        duration: "⏱️ 120 min",
        color: "special",
        day: "Viernes",
        time: "8:00 PM",
        buttonText: "¡Únete!",
        location: "Social Club",
        genre: "Mix",
        level: "Todos"
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
