import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityFormComponent, FormField } from '../../../../shared/components/entity-form/entity-form.component';
import { ShipmentService } from '../../../../core/services/shipment.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { BranchService } from '../../../../core/services/branch.service';
import { forkJoin, map, of } from 'rxjs';
import { Customer, Branch, Shipment } from '../../../../core/interfaces/models.interface';

interface FormData {
  [key: string]: any;
  'dimensions.length'?: number;
  'dimensions.width'?: number;
  'dimensions.height'?: number;
}

@Component({
  selector: 'app-shipment-form',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  template: `
    <div class="shipment-form-page">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit' : 'Create' }} Shipment</h1>
      </div>

      <app-entity-form
        [fields]="formFields"
        [initialData]="shipment"
        [submitButtonText]="isEditMode ? 'Update' : 'Create'"
        [isSubmitting]="isSubmitting"
        (onSubmit)="onSubmit($event)"
        (onCancel)="onCancel()"
      ></app-entity-form>
    </div>
  `,
  styles: [`
    .shipment-form-page {
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
export class ShipmentFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shipmentService = inject(ShipmentService);
  private customerService = inject(CustomerService);
  private branchService = inject(BranchService);

  isEditMode = false;
  isSubmitting = false;
  shipment: Partial<Shipment> = {};
  customers: Customer[] = [];
  branches: Branch[] = [];

  formFields: FormField[] = [];

  ngOnInit(): void {
    const shipmentId = this.route.snapshot.params['id'];
    this.isEditMode = !!shipmentId;

    // Load necessary data
    forkJoin({
      customers: this.customerService.getAll(),
      branches: this.branchService.getAll(),
      shipment: this.isEditMode ? this.shipmentService.getById(shipmentId) : of(null)
    }).pipe(
      map(data => ({
        customers: data.customers.data || [],
        branches: data.branches.data || [],
        shipment: data.shipment?.data || null
      }))
    ).subscribe({
      next: (data) => {
        this.customers = data.customers;
        this.branches = data.branches;

        if (this.isEditMode && data.shipment) {
          this.shipment = data.shipment;
        }

        this.initializeFormFields();
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  private initializeFormFields(): void {
    this.formFields = [
      {
        key: 'senderId',
        label: 'Sender',
        type: 'select',
        validators: { required: true },
        options: this.customers.map(c => ({
          value: c.id,
          label: `${c.name} ${c.surname}`
        }))
      },
      {
        key: 'receiverId',
        label: 'Receiver',
        type: 'select',
        validators: { required: true },
        options: this.customers.map(c => ({
          value: c.id,
          label: `${c.name} ${c.surname}`
        }))
      },
      {
        key: 'sourceBranchId',
        label: 'Source Branch',
        type: 'select',
        validators: { required: true },
        options: this.branches.map(b => ({
          value: b.id,
          label: b.name
        }))
      },
      {
        key: 'destinationBranchId',
        label: 'Destination Branch',
        type: 'select',
        validators: { required: true },
        options: this.branches.map(b => ({
          value: b.id,
          label: b.name
        }))
      },
      {
        key: 'content',
        label: 'Content Description',
        type: 'textarea',
        validators: { required: true, maxLength: 500 }
      },
      {
        key: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        validators: { required: true, min: 0 }
      },
      {
        key: 'dimensions.length',
        label: 'Length (cm)',
        type: 'number',
        validators: { required: true, min: 0 }
      },
      {
        key: 'dimensions.width',
        label: 'Width (cm)',
        type: 'number',
        validators: { required: true, min: 0 }
      },
      {
        key: 'dimensions.height',
        label: 'Height (cm)',
        type: 'number',
        validators: { required: true, min: 0 }
      }
    ];
  }

  onSubmit(formData: FormData): void {
    this.isSubmitting = true;

    const shipmentData: Partial<Shipment> = {
      ...formData,
      dimensions: {
        length: formData['dimensions.length'] || 0,
        width: formData['dimensions.width'] || 0,
        height: formData['dimensions.height'] || 0
      }
    };

    // Remove the flat dimension fields
    delete formData['dimensions.length'];
    delete formData['dimensions.width'];
    delete formData['dimensions.height'];

    const request = this.isEditMode
      ? this.shipmentService.update(this.shipment.id!, shipmentData as Shipment)
      : this.shipmentService.create(shipmentData as Shipment);

    request.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.isSuccessful) {
          this.router.navigate(['/shipments']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving shipment:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/shipments']);
  }
} 