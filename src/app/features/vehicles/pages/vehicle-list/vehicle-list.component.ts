import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, Column } from '../../../../shared/components/data-table/data-table.component';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { Vehicle } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="vehicle-list">
      <div class="page-header">
        <h1>Vehicles</h1>
        <button class="btn btn-primary" routerLink="new">Create New Vehicle</button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="vehicles"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .vehicle-list {
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

    .btn-primary {
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #0056b3;
      }
    }
  `]
})
export class VehicleListComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private notificationService = inject(NotificationService);
  
  vehicles: Vehicle[] = [];
  
  columns: Column[] = [
    { key: 'plateNumber', label: 'Plate Number', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'capacity', label: 'Capacity', sortable: true },
    { key: 'status', label: 'Status', sortable: true,
      format: (value) => {
        const statusMap: Record<string, string> = {
          'AVAILABLE': 'Available',
          'IN_USE': 'In Use',
          'MAINTENANCE': 'Maintenance'
        };
        return statusMap[value] || value;
      }
    }
  ];

  ngOnInit(): void {
    this.loadVehicles();
  }

  private loadVehicles(): void {
    this.vehicleService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.vehicles = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading vehicles:', error);
        this.notificationService.error('Failed to load vehicles');
      }
    });
  }

  onEdit(vehicle: Vehicle): void {
    window.location.href = `/vehicles/${vehicle.id}/edit`;
  }

  onDelete(vehicle: Vehicle): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.delete(vehicle.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Vehicle deleted successfully');
            this.loadVehicles();
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