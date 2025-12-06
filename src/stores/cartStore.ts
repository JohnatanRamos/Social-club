import { persistentAtom } from '@nanostores/persistent';
import type { CartCourseItem, CheckoutCourse } from '../types/Checkout';

export const cartStore = persistentAtom<CartCourseItem[]>('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const addToCart = (course: CheckoutCourse) => {
  const currentCart = cartStore.get();
  const newItem: CartCourseItem = {
    ...course,
    uniqueId: Date.now(),
    mode: 'individual',
    partner: { fullName: '', cedula: '', whatsapp: '', email: '' }
  };
  cartStore.set([...currentCart, newItem]);
};

export const removeFromCart = (uniqueId: number) => {
  const currentCart = cartStore.get();
  cartStore.set(currentCart.filter(item => item.uniqueId !== uniqueId));
};
