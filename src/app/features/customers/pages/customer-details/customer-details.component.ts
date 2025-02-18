import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="customer-details">
      <div class="page-header">
        <h1>Customer Details</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="onEdit()">Edit</button>
          <button class="btn btn-danger" (click)="onDelete()">Delete</button>
        </div>
      </div>

      <div class="details-card" *ngIf="customer">
        <div class="detail-content">
          <div class="detail-item">
            <label>First Name</label>
            <span>{{ customer.name }}</span>
          </div>
          <div class="detail-item">
            <label>Last Name</label>
            <span>{{ customer.surname }}</span>
          </div>
          <div class="detail-item">
            <label>Email</label>
            <span>{{ customer.email }}</span>
          </div>
          <div class="detail-item">
            <label>Phone</label>
            <span>{{ customer.phone }}</span>
          </div>
          <div class="detail-item">
            <label>Address</label>
            <span>{{ customer.address }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .customer-details {
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
  `]
})
export class CustomerDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);

  customer: Customer | null = null;

  ngOnInit(): void {
    const customerId = this.route.snapshot.params['id'];
    this.loadCustomer(customerId);
  }

  private loadCustomer(id: string): void {
    this.customerService.getById(id).subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.customer = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.notificationService.error('Failed to load customer details');
        this.router.navigate(['/customers']);
      }
    });
  }

  onEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete(): void {
    if (this.customer && confirm('Are you sure you want to delete this customer?')) {
      this.customerService.delete(this.customer.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Customer deleted successfully');
            this.router.navigate(['/customers']);
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