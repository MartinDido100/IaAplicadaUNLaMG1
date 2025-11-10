import { ChangeDetectionStrategy, Component, inject, input, OnInit, OnDestroy, signal } from '@angular/core';
import { Logo } from '../logo/logo';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-transition-animation',
  imports: [Logo],
  templateUrl: './transition-animation.html',
  styleUrl: './transition-animation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class TransitionAnimation implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  
  // Inputs para personalizar la animación
  duration = input<number>(4500); // Duración en ms - 4.5 segundos para el audio completo
  logoSize = input<number>(4); // Tamaño del logo
  message = input<string>('Iniciando sesión...');
  
  // Estado interno
  showAnimation = signal(true);
  animationPhase = signal<'fade-in' | 'show' | 'fade-out'>('fade-in');
  
  // Audio
  private audio: HTMLAudioElement | null = null;
  
  get isDarkMode() {
    return this.themeService.isDarkMode;
  }
  
  ngOnInit() {
    this.loadAndPlayAudio();
    this.startAnimationSequence();
  }
  
  private loadAndPlayAudio() {
    try {
      this.audio = new Audio('assets/audio/intro.mp3');
      this.audio.volume = 0.4; // Volumen al 40%
      this.audio.play().catch(error => {
        console.warn('No se pudo reproducir el audio:', error);
      });
    } catch (error) {
      console.warn('Error al cargar el audio:', error);
    }
  }
  
  private startAnimationSequence() {
    // Fase 1: Fade in (300ms)
    setTimeout(() => {
      this.animationPhase.set('show');
    }, 300);
    
    // Fase 2: Mostrar durante la mayor parte de la duración
    setTimeout(() => {
      this.animationPhase.set('fade-out');
    }, this.duration() - 300);
    
    // Fase 3: Fade out completo
    setTimeout(() => {
      this.showAnimation.set(false);
    }, this.duration());
  }
  
  ngOnDestroy() {
    this.stopAudio();
  }
  
  private stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.audio = null;
    }
  }
}