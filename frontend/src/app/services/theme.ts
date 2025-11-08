import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'mindflix-theme';
  private _isDarkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  get isDarkMode() {
    return this._isDarkMode();
  }

  get currentTheme(): Theme {
    return this._isDarkMode() ? 'dark' : 'light';
  }

  toggleTheme(): void {
    const newTheme = this._isDarkMode() ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this._isDarkMode.set(theme === 'dark');
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const theme: Theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark');
    } else {
      root.setAttribute('data-theme', 'light');
      root.classList.remove('dark');
    }
  }
}