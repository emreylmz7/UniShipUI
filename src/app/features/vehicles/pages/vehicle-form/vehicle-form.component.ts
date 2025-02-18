import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityFormComponent, FormField } from '../../../../shared/components/entity-form/entity-form.component';
import { VehicleService } from '../../../../core/services/vehicle.service';
import { BranchService } from '../../../../core/services/branch.service';
import { Vehicle, Branch } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';
import { forkJoin, map, of } from 'rxjs';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  template: `
    <div class="vehicle-form-page">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit' : 'Create' }} Vehicle</h1>
      </div>

      <app-entity-form
        [fields]="formFields"
        [initialData]="vehicle"
        [submitButtonText]="isEditMode ? 'Update' : 'Create'"
        [isSubmitting]="isSubmitting"
        (onSubmit)="onSubmit($event)"
        (onCancel)="onCancel()"
      ></app-entity-form>
    </div>
  `,
  styles: [`
    .vehicle-form-page {
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
export class VehicleFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vehicleService = inject(VehicleService);
  private branchService = inject(BranchService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  isSubmitting = false;
  vehicle: Partial<Vehicle> = {};
  branches: Branch[] = [];

  formFields: FormField[] = [
    {
      key: 'plateNumber',
      label: 'Plate Number',
      type: 'text',
      validators: {
        required: true,
        minLength: 5,
        maxLength: 20
      }
    },
    {
      key: 'type',
      label: 'Vehicle Type',
      type: 'select',
      validators: {
        required: true
      },
      options: [
        { value: 'TRUCK', label: 'Truck' },
        { value: 'VAN', label: 'Van' },
        { value: 'MOTORCYCLE', label: 'Motorcycle' }
      ]
    },
    {
      key: 'capacity',
      label: 'Capacity (kg)',
      type: 'number',
      validators: {
        required: true,
        min: 0
      }
    },
    {
      key: 'branchId',
      label: 'Branch',
      type: 'select',
      validators: {
        required: true
      },
      options: []
    }
  ];

  ngOnInit(): void {
    const vehicleId = this.route.snapshot.params['id'];
    this.isEditMode = !!vehicleId;

    // Load branches and vehicle data if in edit mode
    forkJoin({
      branches: this.branchService.getAll(),
      vehicle: this.isEditMode ? this.vehicleService.getById(vehicleId) : of(null)
    }).pipe(
      map(data => ({
        branches: data.branches.data || [],
        vehicle: data.vehicle?.data || null
      }))
    ).subscribe({
      next: (data) => {
        this.branches = data.branches;
        this.updateBranchOptions();

        if (this.isEditMode && data.vehicle) {
          this.vehicle = data.vehicle;
        }
      },
      error: (error) => {
        console.error('Error loading form data:', error);
        this.notificationService.error('Failed to load form data');
        this.router.navigate(['/vehicles']);
      }
    });
  }

  private updateBranchOptions(): void {
    const branchField = this.formFields.find(f => f.key === 'branchId');
    if (branchField) {
      branchField.options = this.branches.map(branch => ({
        value: branch.id,
        label: branch.name
      }));
    }
  }

  onSubmit(formData: Partial<Vehicle>): void {
    this.isSubmitting = true;

    const request = this.isEditMode
      ? this.vehicleService.update(this.vehicle.id!, formData as Vehicle)
      : this.vehicleService.create(formData as Vehicle);

    request.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.isSuccessful) {
          this.notificationService.success(
            `Vehicle ${this.isEditMode ? 'updated' : 'created'} successfully`
          );
          this.router.navigate(['/vehicles']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving vehicle:', error);
        this.notificationService.error(
          `Failed to ${this.isEditMode ? 'update' : 'create'} vehicle`
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/vehicles']);
  }
} 