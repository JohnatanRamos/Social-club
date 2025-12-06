import { useState } from 'react';
import { type CartCourseItem, type User, type CheckoutCourse, type CourseMode, type Partner } from '../types/Checkout';

export const useCheckout = () => {
  const [mainUser, setMainUser] = useState<User>({
    fullName: '',
    cedula: '',
    whatsapp: '',
    email: '',
    dob: ''
  });

  const [cart, setCart] = useState<CartCourseItem[]>([
    {
      uniqueId: Date.now(),
      mode: 'individual',
      partner: { fullName: '', cedula: '', whatsapp: '', email: '' },
      id: '',
      name: '',
      instructor: '',
      duration: '',
      price: 0
    }
  ]);

  const handleMainUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainUser({ ...mainUser, [e.target.name]: e.target.value });
  };

  const toggleCourseMode = (index: number, mode: CourseMode) => {
    const newCart = [...cart];
    newCart[index].mode = mode;
    setCart(newCart);
  };

  const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
    const newCart = [...cart];
    newCart[index].partner[field] = value;
    setCart(newCart);
  };

  const autofillPartner = (targetIndex: number) => {
    const sourceCourse = cart.find((c, i) => i !== targetIndex && c.mode === 'pareja' && c.partner.fullName !== '');

    if (sourceCourse) {
      const newCart = [...cart];
      newCart[targetIndex].partner = { ...sourceCourse.partner };
      setCart(newCart);
    } else {
      alert("No hay datos de pareja previos para copiar.");
    }
  };

  const removeCourse = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const addCourseToCart = (course: CheckoutCourse) => {
    setCart([...cart, {
      ...course,
      uniqueId: Date.now(),
      mode: 'individual',
      partner: { fullName: '', cedula: '', whatsapp: '', email: '' }
    }]);
  };

  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.mode === 'pareja' ? item.price * 2 : item.price;
    return acc + itemPrice;
  }, 0);

  return {
    mainUser,
    cart,
    handleMainUserChange,
    toggleCourseMode,
    handlePartnerChange,
    autofillPartner,
    removeCourse,
    addCourseToCart,
    subtotal
  };
};
