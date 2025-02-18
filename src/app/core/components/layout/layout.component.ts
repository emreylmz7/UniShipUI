import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { LoadingIndicatorComponent } from '../../../shared/components/loading-indicator/loading-indicator.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingIndicatorComponent],
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="navbar-brand">
          <a routerLink="/" class="brand-link">UniShip</a>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/shipments" routerLinkActive="active">Shipments</a></li>
          <li><a routerLink="/customers" routerLinkActive="active">Customers</a></li>
          <li><a routerLink="/branches" routerLinkActive="active">Branches</a></li>
          <li><a routerLink="/vehicles" routerLinkActive="active">Vehicles</a></li>
        </ul>
        <div class="nav-actions">
          <button class="btn btn-logout" (click)="logout()">Logout</button>
        </div>
      </nav>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <app-loading-indicator
        *ngIf="loadingService.isLoading()"
        [overlay]="true"
        message="Loading..."
      ></app-loading-indicator>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
      background-color: #1a237e;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: bold;
    }

    .brand-link {
      color: white;
      text-decoration: none;
      
      &:hover {
        color: #e3f2fd;
      }
    }

    .nav-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
      margin: 0;
      padding: 0;

      a {
        color: white;
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: background-color 0.2s;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &.active {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }

    .btn-logout {
      padding: 0.5rem 1rem;
      border: 1px solid white;
      background: transparent;
      color: white;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: white;
        color: #1a237e;
      }
    }

    .main-content {
      flex: 1;
      padding: 2rem;
      background-color: #f5f5f5;
    }
  `]
})
export class LayoutComponent {
  private authService = inject(AuthService);
  protected loadingService = inject(LoadingService);

  logout(): void {
    this.authService.logout();
  }
} 