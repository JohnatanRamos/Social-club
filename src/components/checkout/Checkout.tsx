import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useCheckout } from '../../hooks/useCheckout';
import { PersonalDataForm } from './PersonalDataForm';
import { CourseItem } from './CourseItem';
import { OrderSummary } from './OrderSummary';
import { RelatedCoursesCarousel } from './RelatedCoursesCarousel';
import { DiscountUpsellModal } from './DiscountUpsellModal';

export default function Checkout() {
  const {
    mainUser,
    cart,
    handleMainUserChange,
    toggleCourseMode,
    handlePartnerChange,
    autofillPartner,
    removeCourse,
    subtotal,
    bundleDiscount,
    promptPaymentDiscount,
    total,
    isPromptPayment,
    togglePromptPayment
  } = useCheckout();

  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);

  const handleCheckoutClick = () => {
    const individualCourses = cart.filter(item => item.mode === 'individual' && !item.promotion);
    // Show upsell if they haven't reached the max bundle discount (3 courses)
    if (individualCourses.length < 3) {
      setIsUpsellModalOpen(true);
    } else {
      window.location.href = '/success';
    }
  };

  const handleContinueToPayment = () => {
    window.location.href = '/success';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* --- COLUMNA DERECHA: FORMULARIOS --- */}
          <div className="w-full lg:w-2/3 order-1 lg:order-1 space-y-8">

            {/* 1. Datos del Responsable */}
            <PersonalDataForm user={mainUser} onChange={handleMainUserChange} />

            {/* 2. Detalles de los Cursos */}
            <section className="space-y-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Configuración de Cursos</h2>
                  <p className="text-sm text-slate-500">Define si asistirás solo o acompañado a cada clase.</p>
                </div>
              </div>

              {cart.map((item, index) => (
                <CourseItem
                  key={item.uniqueId}
                  item={item}
                  index={index}
                  mainUserName={mainUser.fullName}
                  onToggleMode={toggleCourseMode}
                  onPartnerChange={handlePartnerChange}
                  onAutofillPartner={autofillPartner}
                  showAutofill={cart.filter(c => c.mode === 'pareja').length > 1}
                />
              ))}

              {cart.length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">Tu carrito está vacío</h3>
                  <p className="text-slate-500">Selecciona cursos del horario para comenzar.</p>
                </div>
              )}
            </section>

            <RelatedCoursesCarousel cart={cart} />
          </div>

          {/* --- COLUMNA IZQUIERDA: RESUMEN DE COMPRA (Sticky) --- */}
          <OrderSummary
            cart={cart}
            subtotal={subtotal}
            total={total}
            bundleDiscount={bundleDiscount}
            promptPaymentDiscount={promptPaymentDiscount}
            isPromptPayment={isPromptPayment}
            onTogglePromptPayment={togglePromptPayment}
            onRemoveCourse={removeCourse}
            onCheckout={handleCheckoutClick}
          />

        </div>
      </section>

      <DiscountUpsellModal
        isOpen={isUpsellModalOpen}
        onClose={() => setIsUpsellModalOpen(false)}
        onContinue={handleContinueToPayment}
        cart={cart}
      />
    </div>
  );
}