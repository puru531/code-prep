import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();
  private storageKey = 'theme-preference';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  initTheme(): void {
    // Check for system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check for stored preference, default to system preference if not available
    const storedTheme = localStorage.getItem(this.storageKey) as Theme | null;
    const isDark = storedTheme === 'dark' || (storedTheme === null && prefersDark);
    
    // Set the initial theme state
    this.isDarkTheme.next(isDark);
    
    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem(this.storageKey)) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme: Theme): void {
    const isDark = theme === 'dark';
    const html = document.documentElement;
    
    // Apply theme to DOM directly
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Force a style recalculation by accessing offsetHeight
    // This is a hack but sometimes helps when style changes aren't applying
    // eslint-disable-next-line no-unused-expressions
    html.offsetHeight;
    
    // Store the current theme preference
    localStorage.setItem(this.storageKey, theme);
    
    // Update the BehaviorSubject with the current theme state
    this.isDarkTheme.next(isDark);
    
    console.log('Theme set to:', theme, 'Dark mode is:', isDark, 'Class applied:', html.classList.contains('dark'));
  }

  toggleTheme(): void {
    // Get the current state
    const isDark = this.isDarkTheme.getValue();
    
    // Toggle to the opposite state
    const newTheme = isDark ? 'light' : 'dark';
    
    console.log('Toggling theme from:', isDark ? 'dark' : 'light', 'to:', newTheme);
    
    // Apply the new theme
    this.setTheme(newTheme);
    
    // Force reload styles by triggering a small DOM change and back
    document.body.classList.add('theme-transitioning');
    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 50);
  }
}
