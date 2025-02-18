import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, Column } from '../../../../shared/components/data-table/data-table.component';
import { ShipmentService } from '../../../../core/services/shipment.service';
import { Shipment } from '../../../../core/interfaces/models.interface';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="shipment-list">
      <div class="page-header">
        <h1>Shipments</h1>
        <button class="btn btn-primary" routerLink="new">Create New Shipment</button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="shipments"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .shipment-list {
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
export class ShipmentListComponent implements OnInit {
  private shipmentService = inject(ShipmentService);
  
  shipments: Shipment[] = [];
  
  columns: Column[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'content', label: 'Content', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'weight', label: 'Weight', sortable: true },
    {
      key: 'dimensions',
      label: 'Dimensions',
      format: (value) => `${value.length}x${value.width}x${value.height}`
    }
  ];

  ngOnInit(): void {
    this.loadShipments();
  }

  private loadShipments(): void {
    this.shipmentService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.shipments = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading shipments:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  onEdit(shipment: Shipment): void {
    window.location.href = `/shipments/${shipment.id}/edit`;
  }

  onDelete(shipment: Shipment): void {
    if (confirm('Are you sure you want to delete this shipment?')) {
      this.shipmentService.delete(shipment.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.loadShipments();
          }
        },
        error: (error) => {
          console.error('Error deleting shipment:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }
} 