export interface Event {
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
  type?: string;
  month?: string;
}
