import type { CourseCardProps } from "./Course";

export interface User {
  fullName: string;
  cedula: string;
  whatsapp: string;
  email: string;
  dob: string;
}

export interface Partner extends Omit<User, 'dob'> {}

export type CourseMode = 'individual' | 'pareja';

export interface CartCourseItem extends CourseCardProps {
  uniqueId: number;
  mode: CourseMode;
  partner: Partner;
}