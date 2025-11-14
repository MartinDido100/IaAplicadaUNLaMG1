import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { ThemeService } from '../../services/theme';
import { SkeletonComponent } from '../skeleton/skeleton';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, SkeletonComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  auth = inject(Auth);
  themeService = inject(ThemeService);
  router = inject(Router);

  logout() {
    this.auth.logout();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get isDarkMode() {
    return this.themeService.isDarkMode;
  }

  gotoHome(){
    this.router.navigate(['/']);
  }
}
