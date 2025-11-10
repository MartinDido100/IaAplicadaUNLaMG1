import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  
  transform(date: string | Date): string {
    if (!date) return '';
    
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    
    // Si la fecha es futura, mostrar "Ahora"
    if (diffInMs < 0) {
      return 'Ahora';
    }
    
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    // Menos de 1 minuto
    if (diffInSeconds < 60) {
      return 'Hace un momento';
    }
    
    // Menos de 1 hora
    if (diffInMinutes < 60) {
      return diffInMinutes === 1 ? 'Hace 1 min' : `Hace ${diffInMinutes} min`;
    }
    
    // Menos de 24 horas
    if (diffInHours < 24) {
      return diffInHours === 1 ? 'Hace 1 hora' : `Hace ${diffInHours} horas`;
    }
    
    // Menos de 7 días
    if (diffInDays < 7) {
      return diffInDays === 1 ? 'Hace 1 día' : `Hace ${diffInDays} días`;
    }
    
    // Menos de 4 semanas
    if (diffInWeeks < 4) {
      return diffInWeeks === 1 ? 'Hace 1 semana' : `Hace ${diffInWeeks} semanas`;
    }
    
    // Menos de 12 meses
    if (diffInMonths < 12) {
      return diffInMonths === 1 ? 'Hace 1 mes' : `Hace ${diffInMonths} meses`;
    }
    
    // Más de un año
    if (diffInYears >= 1) {
      return diffInYears === 1 ? 'Hace 1 año' : `Hace ${diffInYears} años`;
    }
    
    // Fallback - mostrar fecha formateada
    return past.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: '2-digit'
    });
  }
}