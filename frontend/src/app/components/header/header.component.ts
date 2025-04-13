import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cp-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  isDarkMode = false;
  private themeSubscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeSubscription = this.themeService.isDarkTheme$.subscribe(
      isDark => {
        console.log('Theme changed in header component:', isDark ? 'dark' : 'light');
        this.isDarkMode = isDark;
      }
    );
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    // Prevent scrolling when mobile menu is open
    if (this.isMenuOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  toggleTheme(): void {
    console.log('Toggle theme button clicked');
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    // Close mobile menu if open
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
  }
}
