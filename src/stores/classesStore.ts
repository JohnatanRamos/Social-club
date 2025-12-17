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
    const response = await fetch('http://72.60.114.240:3000/classes');

    if (!response.ok) {
      throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    classesStore.set(data);
    isInitialized = true;
  } catch (err) {
    console.error('Error fetching classes:', err);
    errorStore.set(err instanceof Error ? err.message : "Error loading classes");
  } finally {
    isLoading.set(false);
  }
};
