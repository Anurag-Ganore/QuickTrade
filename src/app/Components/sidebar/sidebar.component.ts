import { Component, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements AfterViewInit {
  private authService = inject(AuthService);
  isAuthenticated: boolean = false; // Track user authentication state

  constructor(private router: Router) {}

  ngOnInit() {
    this.authService.authState$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
  

  ngAfterViewInit(): void {
    const themeButton = document.getElementById("theme");

    if (themeButton) {
      themeButton.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
      });
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl(`/${path}`);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
