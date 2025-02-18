import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityFormComponent, FormField } from '../../../../shared/components/entity-form/entity-form.component';
import { BranchService } from '../../../../core/services/branch.service';
import { Branch } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [CommonModule, EntityFormComponent],
  template: `
    <div class="branch-form-page">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit' : 'Create' }} Branch</h1>
      </div>

      <app-entity-form
        [fields]="formFields"
        [initialData]="branch"
        [submitButtonText]="isEditMode ? 'Update' : 'Create'"
        [isSubmitting]="isSubmitting"
        (onSubmit)="onSubmit($event)"
        (onCancel)="onCancel()"
      ></app-entity-form>
    </div>
  `,
  styles: [`
    .branch-form-page {
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
export class BranchFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private branchService = inject(BranchService);
  private notificationService = inject(NotificationService);

  isEditMode = false;
  isSubmitting = false;
  branch: Partial<Branch> = {};

  formFields: FormField[] = [
    {
      key: 'name',
      label: 'Branch Name',
      type: 'text',
      validators: {
        required: true,
        minLength: 3,
        maxLength: 100
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
      key: 'email',
      label: 'Email',
      type: 'email',
      validators: {
        required: true,
        email: true
      }
    }
  ];

  ngOnInit(): void {
    const branchId = this.route.snapshot.params['id'];
    this.isEditMode = !!branchId;

    if (this.isEditMode) {
      this.loadBranch(branchId);
    }
  }

  private loadBranch(id: string): void {
    this.branchService.getById(id).subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.branch = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading branch:', error);
        this.notificationService.error('Failed to load branch details');
        this.router.navigate(['/branches']);
      }
    });
  }

  onSubmit(formData: Partial<Branch>): void {
    this.isSubmitting = true;

    const request = this.isEditMode
      ? this.branchService.update(this.branch.id!, formData as Branch)
      : this.branchService.create(formData as Branch);

    request.subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.isSuccessful) {
          this.notificationService.success(
            `Branch ${this.isEditMode ? 'updated' : 'created'} successfully`
          );
          this.router.navigate(['/branches']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error saving branch:', error);
        this.notificationService.error(
          `Failed to ${this.isEditMode ? 'update' : 'create'} branch`
        );
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/branches']);
  }
} 