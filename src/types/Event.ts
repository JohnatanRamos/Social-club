export interface Event {
  image: string;
  color: "orange" | "blue" | "pink" | "green";
  date: Date;
  day: "Lunes" | "Martes" | "Miércoles" | "Jueves" | "Viernes" | "Sábado" | "Domingo";
  time: string;
  title: string;
  description: string;
  location: string;
  price: number;
  type?: string;
  month?: string;
  isFree: boolean;
  featuredEvents: boolean;
}