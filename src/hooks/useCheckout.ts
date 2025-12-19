import { useState, useMemo } from 'react';
import { useStore } from '@nanostores/react';
import { toast } from 'sonner';
import { cartStore } from '../stores/cartStore';
import { type User, type CourseMode, type Partner } from '../types/Checkout';
import { validateUser, validatePartner } from '../utils/validation';

export const useCheckout = () => {
  const [mainUser, setMainUser] = useState<User>({
    fullName: '',
    cedula: '',
    whatsapp: '',
    email: '',
    dob: ''
  });

  const cart = useStore(cartStore);

  const handleMainUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainUser({ ...mainUser, [e.target.name]: e.target.value });
  };

  const toggleCourseMode = (index: number, mode: CourseMode) => {
    const newCart = [...cart];
    newCart[index] = { ...newCart[index], mode };
    cartStore.set(newCart);
  };

  const handlePartnerChange = (index: number, field: keyof Partner, value: string) => {
    const newCart = [...cart];
    newCart[index] = {
      ...newCart[index],
      partner: { ...newCart[index].partner, [field]: value }
    };
    cartStore.set(newCart);
  };

  const autofillPartner = (targetIndex: number) => {
    const sourceCourse = cart.find((c, i) => i !== targetIndex && c.mode === 'pareja' && c.partner.fullName !== '');

    if (sourceCourse) {
      const newCart = [...cart];
      newCart[targetIndex] = { ...newCart[targetIndex], partner: { ...sourceCourse.partner } };
      cartStore.set(newCart);
    } else {
      toast.info("No hay datos de pareja previos para copiar.", {
        position: 'top-right',
      });
    }
  };

  const [isPromptPayment, setIsPromptPayment] = useState(false);

  const togglePromptPayment = () => {
    setIsPromptPayment(!isPromptPayment);
  };

  const removeCourse = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    cartStore.set(newCart);
  };

  const subtotal = cart.reduce((acc, item) => {
    const isCouplePromo = item.mode === 'pareja' && item.promotion;
    const itemPrice = (item.mode === 'pareja' && !isCouplePromo) ? item.price * 2 : item.price;
    return acc + itemPrice;
  }, 0);

  // Calculate Bundle Discount
  const eligibleForBundle = cart.filter(item => item.mode === 'individual' && !item.promotion);
  const eligibleTotal = eligibleForBundle.reduce((acc, item) => acc + item.price, 0);

  let bundleDiscount = 0;
  if (eligibleForBundle.length >= 3) {
    bundleDiscount = eligibleTotal * 0.15;
  } else if (eligibleForBundle.length === 2) {
    bundleDiscount = eligibleTotal * 0.05;
  }
  // Round to 2 decimals
  bundleDiscount = Math.round(bundleDiscount * 100) / 100;

  // Calculate Prompt Payment Discount
  // Applied to the total after bundle discount
  const intermediateTotal = subtotal - bundleDiscount;
  const promptPaymentDiscount = isPromptPayment ? intermediateTotal * 0.05 : 0;

  // Round to 2 decimals
  const finalPromptPaymentDiscount = Math.round(promptPaymentDiscount * 100) / 100;

  const total = Math.round((intermediateTotal - finalPromptPaymentDiscount) * 100) / 100;

  // Validation Logic
  const validationState = useMemo(() => {
    const userValidation = validateUser(mainUser);

    const partnersValidation = cart.map((item) => {
      if (item.mode === 'individual') return { isValid: true, errors: {} };
      return validatePartner(item.partner);
    });

    const isUserValid = userValidation.isValid;
    const arePartnersValid = partnersValidation.every(v => v.isValid);
    const isCartNotEmpty = cart.length > 0;

    return {
      isValid: isUserValid && arePartnersValid && isCartNotEmpty,
      userErrors: userValidation.errors,
      partnerErrors: partnersValidation.map(v => v.errors)
    };
  }, [mainUser, cart]);

  return {
    mainUser,
    cart,
    handleMainUserChange,
    toggleCourseMode,
    handlePartnerChange,
    autofillPartner,
    removeCourse,
    subtotal,
    bundleDiscount,
    promptPaymentDiscount: finalPromptPaymentDiscount,
    total,
    isPromptPayment,
    togglePromptPayment,
    isValid: validationState.isValid,
    userErrors: validationState.userErrors,
    partnerErrors: validationState.partnerErrors
  };
};
