import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';
import { SidebarComponent } from "./Components/sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, SidebarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  isAuthenticated = false;
  showSidebar = false; // Control sidebar visibility

  ngOnInit(): void {
    this.authService.user$.subscribe((user: User | null) => {
      this.isAuthenticated = !!user;
      this.updateSidebarVisibility();
    });

    // Check route changes to control sidebar visibility
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateSidebarVisibility();
      }
    });
  }

  updateSidebarVisibility(): void {
    const hiddenRoutes = ['/login', '/register']; // Hide sidebar on these routes
    this.showSidebar = this.isAuthenticated && !hiddenRoutes.includes(this.router.url);
  }

  logout(): void {
    this.authService.logout()
      .then(() => {
        this.isAuthenticated = false;
        this.showSidebar = false;
        this.router.navigate(['/login']);
      })
      .catch((error: unknown) => console.error('Logout failed:', error));
  }
  
}
