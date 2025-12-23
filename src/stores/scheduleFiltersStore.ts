import { atom } from 'nanostores';

export interface ScheduleFilters {
  location: string;
  genre: string;
  level: string;
  day: string;
  instructor: string;
}

export const initialFilters: ScheduleFilters = {
  location: "",
  genre: "Todos los géneros",
  level: "Todos los niveles",
  day: "Todos los días",
  instructor: "Todos los profesores"
};

export const filtersStore = atom<ScheduleFilters>(initialFilters);

export const setFilter = (key: keyof ScheduleFilters, value: string) => {
  const current = filtersStore.get();
  filtersStore.set({ ...current, [key]: value });
};

export const resetFilters = () => {
  filtersStore.set(initialFilters);
};
