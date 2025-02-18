import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, Column } from '../../../../shared/components/data-table/data-table.component';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="customer-list">
      <div class="page-header">
        <h1>Customers</h1>
        <button class="btn btn-primary" routerLink="new">Create New Customer</button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="customers"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .customer-list {
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
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);
  
  customers: Customer[] = [];
  
  columns: Column[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'surname', label: 'Surname', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'address', label: 'Address', sortable: true }
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.customers = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.notificationService.error('Failed to load customers');
      }
    });
  }

  onEdit(customer: Customer): void {
    window.location.href = `/customers/${customer.id}/edit`;
  }

  onDelete(customer: Customer): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.delete(customer.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Customer deleted successfully');
            this.loadCustomers();
          }
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          this.notificationService.error('Failed to delete customer');
        }
      });
    }
  }
} 