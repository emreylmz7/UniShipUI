import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityFormComponent, FormField } from '../../../../shared/components/entity-form/entity-form.component';
import { CustomerService } from '../../../../core/services/customer.service';
import { Customer } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  template: `
    <div class="customer-form-page">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit' : 'Create' }} Customer</h1>
      </div>

      <app-entity-form
        [fields]="formFields"
        [initialData]="customer"
        [submitButtonText]="isEditMode ? 'Update' : 'Create'"
        [isSubmitting]="isSubmitting"
        (onSubmit)="onSubmit($event)"
        (onCancel)="onCancel()"
      ></app-entity-form>
    </div>
  `,
  styles: [`
    .customer-form-page {
      padding: 1rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;

      h1 {
        margin: 0;
        color: #2c3e50;
      }
    }
  `]
})
export class CustomerFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private customerService = inject(CustomerService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  isSubmitting = false;
  customer: Partial<Customer> = {};

  formFields: FormField[] = [
    {
      key: 'name',
      label: 'First Name',
      type: 'text',
      validators: {
        required: true,
        minLength: 2,
        maxLength: 50
      }
    },
    {
      key: 'surname',
      label: 'Last Name',
      type: 'text',
      validators: {
        required: true,
        minLength: 2,
        maxLength: 50
      }
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      validators: {
        required: true,
        email: true
      }
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'text',
      validators: {
        required: true,
        minLength: 10,
        maxLength: 20
      }
    },
    {
      key: 'address',
      label: 'Address',
      type: 'textarea',
      validators: {
        required: true,
        minLength: 10,
        maxLength: 500
      }
    }
  ];

  ngOnInit(): void {
    const customerId = this.route.snapshot.params['id'];
    this.isEditMode = !!customerId;

    if (this.isEditMode) {
      this.loadCustomer(customerId);
    }
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

  onSubmit(formData: Partial<Customer>): void {
    this.isSubmitting = true;

    const request = this.isEditMode
      ? this.customerService.update(this.customer.id!, formData as Customer)
      : this.customerService.create(formData as Customer);

    request.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.isSuccessful) {
          this.notificationService.success(
            `Customer ${this.isEditMode ? 'updated' : 'created'} successfully`
          );
          this.router.navigate(['/customers']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving customer:', error);
        this.notificationService.error(
          `Failed to ${this.isEditMode ? 'update' : 'create'} customer`
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/customers']);
  }
} 