// Convierte una fecha/hora en formato ISO (UTC) a string HH:mm ajustado a la zona horaria indicada
export function formatTime(value: any, offset: number = 0): string {
  if (typeof value === 'string') {
    // Si es formato ISO tipo "1970-01-01T13:00:00.000Z"
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      // Ajustar la hora por la zona
      date.setHours(date.getHours() + offset);
      return date.toTimeString().slice(0, 5);
    }
    // Si ya está en formato HH:mm
    if (/^\d{2}:\d{2}$/.test(value)) return value;
    // Si es string tipo "08:00:00", lo recortamos
    if (/^\d{2}:\d{2}:\d{2}$/.test(value)) return value.slice(0, 5);
  }
  if (typeof value === 'number') {
    // Si es número, lo interpretamos como minutos desde medianoche
    const hours = Math.floor(value / 60) + offset;
    const minutes = value % 60;
    return `${((hours + 24) % 24).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  if (value instanceof Date) {
    value.setHours(value.getHours() + offset);
    return value.toTimeString().slice(0, 5);
  }
  return '';
}

export function getTimeAgo(fecha: Date): string {
    if (!fecha) return '';
    const now = new Date();
    const diffMs = now.getTime() - fecha.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `hace ${diffSec} segundos`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `hace ${diffMin} minutos`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} horas`;
    const diffDays = Math.floor(diffHrs / 24);
    return `hace ${diffDays} días`;
}

export function getFechaLocal(fecha: string | Date): Date {
  // Si la fecha es string en formato ISO, conviértela a Date y ajusta la zona
  const d = new Date(fecha);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}