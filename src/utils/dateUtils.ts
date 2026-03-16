export const formatDate = (date: Date): string => {
    const transformDate = new Date(date).setHours(24, 0, 0, 0);

    return new Date(transformDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
    });
};

export const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatGoogleCalendarDate = (date: Date): string => {
    return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
};
