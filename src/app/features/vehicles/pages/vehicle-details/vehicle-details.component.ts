import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { BranchService } from '../../../../core/services/branch.service';
import { Vehicle, Branch } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-vehicle-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="vehicle-details">
      <div class="page-header">
        <h1>Vehicle Details</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="onEdit()">Edit</button>
          <button class="btn btn-danger" (click)="onDelete()">Delete</button>
        </div>
      </div>

      <div class="details-card" *ngIf="vehicle">
        <div class="detail-content">
          <div class="detail-item">
            <label>Plate Number</label>
            <span>{{ vehicle.plateNumber }}</span>
          </div>
          <div class="detail-item">
            <label>Type</label>
            <span>{{ getVehicleType(vehicle.type) }}</span>
          </div>
          <div class="detail-item">
            <label>Capacity</label>
            <span>{{ vehicle.capacity }} kg</span>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <span class="status-badge" [class]="'status-' + vehicle.status.toLowerCase()">
              {{ getVehicleStatus(vehicle.status) }}
            </span>
          </div>
          <div class="detail-item" *ngIf="branch">
            <label>Branch</label>
            <span>{{ branch.name }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .vehicle-details {
      padding: 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: #2c3e50;
      }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background-color: #007bff;
      color: white;

      &:hover {
        background-color: #0056b3;
      }
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;

      &:hover {
        background-color: #c82333;
      }
    }

    .details-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .detail-content {
      display: grid;
      gap: 1.5rem;
    }

    .detail-item {
      label {
        display: block;
        color: #6c757d;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
      }

      span {
        color: #2c3e50;
        font-size: 1rem;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;

      &.status-available {
        background-color: #28a745;
      }

      &.status-in-use {
        background-color: #007bff;
      }

      &.status-maintenance {
        background-color: #dc3545;
      }
    }
  `]
})
export class VehicleDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private branchService = inject(BranchService);
  private notificationService = inject(NotificationService);

  vehicle: Vehicle | null = null;
  branch: Branch | null = null;

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.params['id'];
    this.loadVehicleDetails(vehicleId);
  }

  private loadVehicleDetails(id: string): void {
    this.vehicleService.getById(id).subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.vehicle = response.data;
          this.loadBranch(this.vehicle.branchId);
        }
      },
      error: (error) => {
        console.error('Error loading vehicle:', error);
        this.notificationService.error('Failed to load vehicle details');
        this.router.navigate(['/vehicles']);
      }
    });
  }

  private loadBranch(branchId: string): void {
    this.branchService.getById(branchId).subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.branch = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading branch:', error);
        this.notificationService.error('Failed to load branch details');
      }
    });
  }

  getVehicleType(type: string): string {
    const typeMap: Record<string, string> = {
      'TRUCK': 'Truck',
      'VAN': 'Van',
      'MOTORCYCLE': 'Motorcycle'
    };
    return typeMap[type] || type;
  }

  getVehicleStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'AVAILABLE': 'Available',
      'IN_USE': 'In Use',
      'MAINTENANCE': 'Maintenance'
    };
    return statusMap[status] || status;
  }

  onEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete(): void {
    if (this.vehicle && confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.delete(this.vehicle.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Vehicle deleted successfully');
            this.router.navigate(['/vehicles']);
          }
        },
        error: (error) => {
          console.error('Error deleting vehicle:', error);
          this.notificationService.error('Failed to delete vehicle');
        }
      });
    }
  }
} 