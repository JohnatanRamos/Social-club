export interface CourseCardProps {
    id: string;
    name: string;
    instructor: string;
    duration: string;
    price: number;
    color: "red" | "purple" | "orange" | "green" | "blue" | "special";
    day?: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
    time?: string; // e.g., "6:00 PM"
    buttonText?: string;
    location: "Social Club" | "Ritmo Vivo";
    genre?: "Salsa" | "Bachata" | "Merengue" | "Kizomba" | "Tango" | "Mix";
    level?: "Principiante" | "Básico" | "Intermedio" | "Avanzado" | "Todos";
    onAdd?: () => void;
    promotion: boolean;
    capacity: number;
}