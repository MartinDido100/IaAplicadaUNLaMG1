import { Injectable, signal, ComponentRef, ViewContainerRef, createComponent, inject, ApplicationRef, Injector } from '@angular/core';
import { TransitionAnimation } from '../shared/transition-animation/transition-animation';
import { Router } from '@angular/router';

export interface TransitionOptions {
  duration?: number;
  logoSize?: number;
  message?: string;
  redirectTo?: string;
  redirectDelay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TransitionService {
  private router = inject(Router);
  private appRef = inject(ApplicationRef);
  private injector = inject(Injector);
  
  private isTransitioning = signal(false);
  private currentTransitionRef: ComponentRef<TransitionAnimation> | null = null;
  
  get transitioning() {
    return this.isTransitioning();
  }
  
  /**
   * Muestra una animación de transición
   */
  showTransition(options: TransitionOptions = {}): Promise<void> {
    if (this.isTransitioning()) {
      return Promise.resolve();
    }
    
    const {
      duration = 4500, // Duración actualizada a 4.5 segundos para el audio completo
      logoSize = 4,
      message = 'Cargando...',
      redirectTo,
      redirectDelay
    } = options;
    
    return new Promise((resolve) => {
      this.isTransitioning.set(true);
      
      // Crear el componente dinámicamente
      const componentRef = createComponent(TransitionAnimation, {
        environmentInjector: this.appRef.injector,
        elementInjector: this.injector
      });
      
      // Configurar las propiedades del componente
      componentRef.setInput('duration', duration);
      componentRef.setInput('logoSize', logoSize);
      componentRef.setInput('message', message);
      
      // Insertar en el DOM
      document.body.appendChild(componentRef.location.nativeElement);
      
      // Forzar la detección de cambios
      componentRef.changeDetectorRef.detectChanges();
      this.appRef.tick();
      
      this.currentTransitionRef = componentRef;
      
      // Configurar el cleanup después de la duración especificada
      setTimeout(() => {
        this.hideTransition();
        resolve();
      }, duration);
      
      // Si se especifica una redirección, ejecutarla después del delay
      if (redirectTo) {
        const delay = redirectDelay ?? duration - 300; // Por defecto, redirigir 300ms antes del final
        setTimeout(() => {
          this.router.navigate([redirectTo]);
        }, delay);
      }
    });
  }
  
  /**
   * Oculta la animación de transición actual
   */
  hideTransition(): void {
    if (this.currentTransitionRef) {
      // Remover del DOM
      this.currentTransitionRef.location.nativeElement.remove();
      
      // Destruir el componente
      this.currentTransitionRef.destroy();
      this.currentTransitionRef = null;
    }
    
    this.isTransitioning.set(false);
  }
  
  /**
   * Método específico para transiciones de login
   */
  showLoginSuccessTransition(): Promise<void> {
    return this.showTransition({
      duration: 4500,
      logoSize: 5,
      message: '¡Bienvenido a MindFlix!',
      redirectTo: '/',
      redirectDelay: 4000 // Redirigir 500ms antes del final
    });
  }
  
  /**
   * Método específico para transiciones de registro
   */
  showRegisterSuccessTransition(): Promise<void> {
    return this.showTransition({
      duration: 4500,
      logoSize: 5,
      message: '¡Cuenta creada exitosamente!',
      redirectTo: '/',
      redirectDelay: 4000 // Redirigir 500ms antes del final
    });
  }
  
  /**
   * Limpia cualquier transición en curso (útil para OnDestroy)
   */
  cleanup(): void {
    this.hideTransition();
  }
}