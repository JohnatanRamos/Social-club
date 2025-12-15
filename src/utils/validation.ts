export const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidDocument = (doc: string) => {
    return doc.length >= 8;
};

export const isValidWhatsapp = (whatsapp: string) => {
    return whatsapp.length >= 10;
};

export const isAtLeast14YearsOld = (dob: string) => {
    if (!dob) return false;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age >= 14;
};

export interface UserData {
    fullName: string;
    cedula: string;
    whatsapp: string;
    email: string;
    dob: string;
}

export interface PartnerData {
    fullName: string;
    cedula: string;
    whatsapp: string;
    email: string;
}

export const validateUser = (user: UserData) => {
    const errors: Partial<Record<keyof UserData, string>> = {};

    if (!user.fullName.trim()) errors.fullName = "El nombre es requerido";
    if (!isValidDocument(user.cedula)) errors.cedula = "Mínimo 8 caracteres";
    if (!isValidWhatsapp(user.whatsapp)) errors.whatsapp = "Mínimo 10 caracteres";
    if (!user.whatsapp.trim()) errors.whatsapp = "El WhatsApp es requerido";
    if (!isValidEmail(user.email)) errors.email = "Email inválido";
    if (!isAtLeast14YearsOld(user.dob)) errors.dob = "Debes tener al menos 14 años";

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

export const validatePartner = (partner: PartnerData) => {
    const errors: Partial<Record<keyof PartnerData, string>> = {};

    if (!partner.fullName.trim()) errors.fullName = "El nombre es requerido";
    if (!isValidDocument(partner.cedula)) errors.cedula = "Mínimo 8 caracteres";
    if (!isValidWhatsapp(partner.whatsapp)) errors.whatsapp = "Mínimo 10 caracteres";
    if (!partner.whatsapp.trim()) errors.whatsapp = "El WhatsApp es requerido";
    if (!isValidEmail(partner.email)) errors.email = "Email inválido";

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
