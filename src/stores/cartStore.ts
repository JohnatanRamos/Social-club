import { persistentAtom } from '@nanostores/persistent';
import { toast } from 'sonner';
import type { CartCourseItem } from '../types/Checkout';
import type { CourseCardProps } from '../types/Course';

export const cartStore = persistentAtom<CartCourseItem[]>('cart', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export const addToCart = (course: CourseCardProps) => {
  const currentCart = cartStore.get();

  // Check if course is already in cart
  const isCourseInCart = currentCart.some(item => item.id === course.id);
  if (isCourseInCart) {
    toast.warning("Este curso ya está en tu carrito.", {
      position: 'top-right',
    });
    return;
  }

  // Check if location matches existing items in cart
  if (currentCart.length > 0) {
    const cartLocation = currentCart[0].location;
    if (course.location && cartLocation && course.location !== cartLocation) {
      toast.warning(`Debes agregar cursos de la misma sede en una misma compra. Tu carrito actual contiene cursos de: ${cartLocation}. Por favor, finaliza tu compra actual o vacía el carrito para agregar cursos de otra sede.`, {
        position: 'top-right',
      });
      return;
    }
  }

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

export const clearCart = () => {
  cartStore.set([]);
};
