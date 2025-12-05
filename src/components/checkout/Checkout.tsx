import React, { useState, useEffect } from 'react';
import { Trash2, User, Users, CreditCard, ChevronRight, Copy, Check, Ticket, Calendar, Plus } from 'lucide-react';

// --- MOCK DATA (Simulando los cursos que vienen de tu horario) ---
const AVAILABLE_COURSES = [
  { id: 1, name: 'Salsa Básica', instructor: 'Juan Pérez', time: 'Lunes 6:00 PM', price: 80000 },
  { id: 2, name: 'Bachata Sensual', instructor: 'María González', time: 'Martes 6:00 PM', price: 85000 },
  { id: 3, name: 'Kizomba', instructor: 'Carlos Rodríguez', time: 'Lunes 7:00 PM', price: 90000 },
  { id: 4, name: 'Salsa Avanzada', instructor: 'Juan Pérez', time: 'Martes 7:00 PM', price: 95000 },
];

const COUPONS = {
  'SOCIAL10': 0.10,
  'BAILA2024': 0.15
};

// --- COMPONENTES ---

const InputField = ({ label, name, value, onChange, type = "text", required = true, placeholder = "" }) => (
  <div className="flex flex-col space-y-1">
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border border-slate-200 rounded-lg px-4 py-2.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
      required={required}
    />
  </div>
);

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-start space-x-3 mb-6 border-b border-slate-100 pb-4">
    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
      <Icon size={20} />
    </div>
    <div>
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
  </div>
);

export default function App() {
  // Estado del Usuario Responsable
  const [mainUser, setMainUser] = useState({
    fullName: '',
    cedula: '',
    whatsapp: '',
    email: '',
    dob: ''
  });

  // Estado del Carrito (Cursos seleccionados)
  // Iniciamos con un curso pre-seleccionado para la demo
  const [cart, setCart] = useState([
    {
      ...AVAILABLE_COURSES[0],
      uniqueId: Date.now(), // Para manejar keys en react
      mode: 'individual', // 'individual' | 'pareja'
      partner: { fullName: '', cedula: '', whatsapp: '', email: '' }
    }
  ]);

  // Manejador usuario principal
  const handleMainUserChange = (e) => {
    setMainUser({ ...mainUser, [e.target.name]: e.target.value });
  };

  // Manejador cambio de modalidad (Individual/Pareja)
  const toggleCourseMode = (index, mode) => {
    const newCart = [...cart];
    newCart[index].mode = mode;
    setCart(newCart);
  };

  // Manejador datos de pareja
  const handlePartnerChange = (index, field, value) => {
    const newCart = [...cart];
    newCart[index].partner[field] = value;
    setCart(newCart);
  };

  // Función mágica: Copiar datos de la pareja del primer curso que tenga pareja
  const autofillPartner = (targetIndex) => {
    // Buscar algún curso anterior que tenga datos de pareja
    const sourceCourse = cart.find((c, i) => i !== targetIndex && c.mode === 'pareja' && c.partner.fullName !== '');

    if (sourceCourse) {
      const newCart = [...cart];
      newCart[targetIndex].partner = { ...sourceCourse.partner };
      setCart(newCart);
    } else {
      alert("No hay datos de pareja previos para copiar.");
    }
  };

  // Eliminar curso
  const removeCourse = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // Agregar curso (Simulación de seleccionar desde el horario)
  const addCourseToCart = (course) => {
    setCart([...cart, {
      ...course,
      uniqueId: Date.now(),
      mode: 'individual',
      partner: { fullName: '', cedula: '', whatsapp: '', email: '' }
    }]);
  };

  // Cálculos de Totales
  const subtotal = cart.reduce((acc, item) => {
    // Si es pareja, asumimos que el precio se duplica (o puedes cambiar esta lógica si hay precio especial)
    const itemPrice = item.mode === 'pareja' ? item.price * 2 : item.price;
    return acc + itemPrice;
  }, 0);

  const total = subtotal;

  const formatCurrency = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-600">

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">

          {/* --- COLUMNA DERECHA: FORMULARIOS --- */}
          <div className="w-full lg:w-2/3 order-1 lg:order-1 space-y-8">

            {/* 1. Datos del Responsable */}
            <section className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200">
              <SectionTitle
                icon={User}
                title="Tus Datos Personales"
                subtitle="Información del responsable de la inscripción (se llena una única vez)."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField label="Nombre Completo" name="fullName" value={mainUser.fullName} onChange={handleMainUserChange} placeholder="Ej: Pepito Pérez" />
                <InputField label="Cédula / ID" name="cedula" value={mainUser.cedula} onChange={handleMainUserChange} placeholder="Ej: 1032..." />
                <InputField label="Correo Electrónico" name="email" value={mainUser.email} onChange={handleMainUserChange} type="email" placeholder="correo@ejemplo.com" />
                <InputField label="WhatsApp" name="whatsapp" value={mainUser.whatsapp} onChange={handleMainUserChange} placeholder="+57 300..." />
                <InputField label="Fecha de Nacimiento" name="dob" value={mainUser.dob} onChange={handleMainUserChange} type="date" />
              </div>
            </section>

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
                <div key={item.uniqueId} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
                  {/* Header del Curso */}
                  <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                      <div className="flex items-center text-sm text-slate-500 space-x-3 mt-1">
                        <span>{item.time}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{item.instructor}</span>
                      </div>
                    </div>

                    {/* Switch Individual / Pareja */}
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                      <button
                        onClick={() => toggleCourseMode(index, 'individual')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${item.mode === 'individual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Individual
                      </button>
                      <button
                        onClick={() => toggleCourseMode(index, 'pareja')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${item.mode === 'pareja' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        En Pareja
                      </button>
                    </div>
                  </div>

                  {/* Body del Curso */}
                  <div className="p-6">
                    {item.mode === 'individual' ? (
                      <div className="flex items-center text-slate-500 bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
                        <User className="w-5 h-5 mr-3 text-slate-400" />
                        <span className="text-sm">Inscripción individual para <strong>{mainUser.fullName || 'ti'}</strong>.</span>
                      </div>
                    ) : (
                      <div className="animate-fadeIn">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-bold text-orange-600 uppercase tracking-wide flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Datos de la Pareja
                          </h4>

                          {/* Botón Mágico de Autofill */}
                          {cart.filter(c => c.mode === 'pareja').length > 1 && (
                            <button
                              onClick={() => autofillPartner(index)}
                              type="button"
                              className="text-xs flex items-center text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              <Copy size={14} className="mr-1.5" />
                              Copiar de pareja anterior
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                          <InputField
                            label="Nombre Pareja"
                            name="fullName"
                            value={item.partner.fullName}
                            onChange={(e) => handlePartnerChange(index, 'fullName', e.target.value)}
                            placeholder="Nombre completo"
                          />
                          <InputField
                            label="Cédula Pareja"
                            name="cedula"
                            value={item.partner.cedula}
                            onChange={(e) => handlePartnerChange(index, 'cedula', e.target.value)}
                          />
                          <InputField
                            label="WhatsApp Pareja"
                            name="whatsapp"
                            value={item.partner.whatsapp}
                            onChange={(e) => handlePartnerChange(index, 'whatsapp', e.target.value)}
                          />
                          <InputField
                            label="Email Pareja"
                            name="email"
                            value={item.partner.email}
                            onChange={(e) => handlePartnerChange(index, 'email', e.target.value)}
                            type="email"
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-3 text-right">No es necesario llenar fecha de nacimiento para la pareja.</p>
                      </div>
                    )}
                  </div>
                </div>
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
          </div>

          {/* --- COLUMNA IZQUIERDA: RESUMEN DE COMPRA (Sticky) --- */}
          <aside className="w-full lg:w-1/3 order-2 lg:order-2 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white font-medium flex items-center">
                  <Ticket className="w-5 h-5 mr-2 text-orange-500" />
                  Resumen de Compra
                </h3>
                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full">{cart.length} cursos</span>
              </div>

              <div className="p-6 space-y-6">
                {/* Lista Miniatura */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {cart.length === 0 ? (
                    <p className="text-center text-slate-400 py-4 text-sm">No has seleccionado cursos aún.</p>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={item.uniqueId} className="flex justify-between items-start text-sm group">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.time}</p>
                          <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            {item.mode === 'pareja' ? 'Pareja (x2)' : 'Individual'}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-slate-900">
                            {formatCurrency(item.mode === 'pareja' ? item.price * 2 : item.price)}
                          </p>
                          <button onClick={() => removeCourse(idx)} className="text-red-400 hover:text-red-600 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">

                  {/* Totales */}
                  <div className="space-y-2 pt-2 text-sm">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    {/* {discountApplied > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Descuento ({(discountApplied * 100).toFixed(0)}%)</span>
                        <span>- {formatCurrency(discountAmount)}</span>
                      </div>
                    )} */}
                    <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                      <span>Total a Pagar</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center space-x-2"
                  disabled={cart.length === 0}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Finalizar Inscripción</span>
                </button>
                <p className="text-xs text-center text-slate-400">
                  Al completar, aceptas nuestros términos y condiciones.
                </p>
              </div>
            </div>

            {/* Simulador para agregar más cursos (Solo Demo) */}
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-bold text-slate-500 mb-2 uppercase">Simular selección desde horario</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COURSES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => addCourseToCart(c)}
                    className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-full hover:border-orange-500 hover:text-orange-600 transition-colors flex items-center"
                  >
                    <Plus size={12} className="mr-1" /> {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </section>
    </div>
  );
}