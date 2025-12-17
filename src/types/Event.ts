export interface Event {
  image: string;
  color: "text-sc-orange" | "text-rv-aqua" | "text-pink-600" | "text-purple-600";
  date: string;
  title: string;
  description: string;
  location: string;
  price: number;
  buttonClass?: string;
  type?: string;
  month?: string;
  isFree: boolean;
  featuredEvents: boolean;
}