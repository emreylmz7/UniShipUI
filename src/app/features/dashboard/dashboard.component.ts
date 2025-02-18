import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShipmentService } from '../../core/services/shipment.service';
import { CustomerService } from '../../core/services/customer.service';
import { BranchService } from '../../core/services/branch.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <h1 class="dashboard-title">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card" [routerLink]="['/shipments']">
          <div class="stat-content">
            <h3>Active Shipments</h3>
            <p class="stat-number">{{ stats.activeShipments }}</p>
          </div>
        </div>

        <div class="stat-card" [routerLink]="['/customers']">
          <div class="stat-content">
            <h3>Total Customers</h3>
            <p class="stat-number">{{ stats.totalCustomers }}</p>
          </div>
        </div>

        <div class="stat-card" [routerLink]="['/branches']">
          <div class="stat-content">
            <h3>Branches</h3>
            <p class="stat-number">{{ stats.totalBranches }}</p>
          </div>
        </div>

        <div class="stat-card" [routerLink]="['/vehicles']">
          <div class="stat-content">
            <h3>Available Vehicles</h3>
            <p class="stat-number">{{ stats.availableVehicles }}</p>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Shipments</h2>
        <div class="activity-list">
          <div *ngFor="let shipment of recentShipments" class="activity-item">
            <div class="activity-content">
              <h4>Shipment #{{ shipment.id }}</h4>
              <p>{{ shipment.content }}</p>
              <span class="activity-status" [class]="'status-' + shipment.status?.toLowerCase()">
                {{ shipment.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 1rem;
    }

    .dashboard-title {
      margin-bottom: 2rem;
      color: #2c3e50;
      font-size: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      h3 {
        color: #6c757d;
        margin: 0;
        font-size: 1.1rem;
      }

      .stat-number {
        color: #2c3e50;
        font-size: 2rem;
        font-weight: bold;
        margin: 0.5rem 0 0;
      }
    }

    .recent-activity {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        color: #2c3e50;
        margin: 0 0 1.5rem;
        font-size: 1.5rem;
      }
    }

    .activity-list {
      display: grid;
      gap: 1rem;
    }

    .activity-item {
      padding: 1rem;
      border-radius: 4px;
      background: #f8f9fa;
      transition: background-color 0.2s;

      &:hover {
        background: #e9ecef;
      }

      h4 {
        color: #2c3e50;
        margin: 0 0 0.5rem;
      }

      p {
        color: #6c757d;
        margin: 0;
      }
    }

    .activity-status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 0.5rem;

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-in-transit {
        background: #cce5ff;
        color: #004085;
      }

      &.status-delivered {
        background: #d4edda;
        color: #155724;
      }

      &.status-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  private customerService = inject(CustomerService);
  private branchService = inject(BranchService);
  private vehicleService = inject(VehicleService);

  stats = {
    activeShipments: 0,
    totalCustomers: 0,
    totalBranches: 0,
    availableVehicles: 0
  };

  recentShipments: any[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    forkJoin({
      shipments: this.shipmentService.getAll(),
      customers: this.customerService.getAll(),
      branches: this.branchService.getAll(),
      vehicles: this.vehicleService.getAll()
    }).subscribe({
      next: (data) => {
        if (data.shipments.isSuccessful && data.shipments.data) {
          this.recentShipments = data.shipments.data
            .slice(0, 5)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          this.stats.activeShipments = data.shipments.data.filter(s => 
            s.status === 'PENDING' || s.status === 'IN_TRANSIT'
          ).length;
        }

        if (data.customers.isSuccessful && data.customers.data) {
          this.stats.totalCustomers = data.customers.data.length;
        }

        if (data.branches.isSuccessful && data.branches.data) {
          this.stats.totalBranches = data.branches.data.length;
        }

        if (data.vehicles.isSuccessful && data.vehicles.data) {
          this.stats.availableVehicles = data.vehicles.data.filter(v => 
            v.status === 'AVAILABLE'
          ).length;
        }
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }
} 