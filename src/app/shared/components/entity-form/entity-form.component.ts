import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea';
  validators?: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: { value: any; label: string }[];
}

@Component({
  selector: 'app-entity-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmitForm()" class="entity-form">
      <div *ngFor="let field of fields" class="form-group">
        <label [for]="field.key">{{ field.label }}</label>
        
        <ng-container [ngSwitch]="field.type">
          <!-- Text, Email, Number inputs -->
          <input
            *ngSwitchCase="'text'"
            [id]="field.key"
            [type]="field.type"
            [formControlName]="field.key"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"
          />
          
          <input
            *ngSwitchCase="'email'"
            [id]="field.key"
            type="email"
            [formControlName]="field.key"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"
          />
          
          <input
            *ngSwitchCase="'number'"
            [id]="field.key"
            type="number"
            [formControlName]="field.key"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"
          />
          
          <!-- Select -->
          <select
            *ngSwitchCase="'select'"
            [id]="field.key"
            [formControlName]="field.key"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"
          >
            <option value="">Select {{ field.label }}</option>
            <option
              *ngFor="let option of field.options"
              [value]="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          
          <!-- Textarea -->
          <textarea
            *ngSwitchCase="'textarea'"
            [id]="field.key"
            [formControlName]="field.key"
            class="form-control"
            [class.is-invalid]="isFieldInvalid(field.key)"
            rows="3"
          ></textarea>
        </ng-container>

        <!-- Validation messages -->
        <div class="invalid-feedback" *ngIf="isFieldInvalid(field.key)">
          <ng-container [ngSwitch]="true">
            <span *ngSwitchCase="form.get(field.key)?.errors?.['required']">
              {{ field.label }} is required
            </span>
            <span *ngSwitchCase="form.get(field.key)?.errors?.['email']">
              Please enter a valid email address
            </span>
            <span *ngSwitchCase="form.get(field.key)?.errors?.['minlength']">
              {{ field.label }} must be at least {{ field.validators?.minLength }} characters
            </span>
            <span *ngSwitchCase="form.get(field.key)?.errors?.['maxlength']">
              {{ field.label }} cannot exceed {{ field.validators?.maxLength }} characters
            </span>
            <span *ngSwitchCase="form.get(field.key)?.errors?.['min']">
              {{ field.label }} must be at least {{ field.validators?.min }}
            </span>
            <span *ngSwitchCase="form.get(field.key)?.errors?.['max']">
              {{ field.label }} cannot exceed {{ field.validators?.max }}
            </span>
          </ng-container>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" (click)="onCancel.emit()">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary" [disabled]="!form.valid || isSubmitting">
          {{ isSubmitting ? 'Saving...' : submitButtonText }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .entity-form {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #495057;
        font-weight: 500;
      }
    }

    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }

      &.is-invalid {
        border-color: #dc3545;
        
        &:focus {
          box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        }
      }
    }

    .invalid-feedback {
      display: block;
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
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

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #5a6268;
      }
    }

    select.form-control {
      appearance: none;
      background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23343a40' viewBox='0 0 12 12'%3E%3Cpath d='M3 5l3 3 3-3'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 12px 12px;
      padding-right: 2rem;
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }
  `]
})
export class EntityFormComponent implements OnInit {
  @Input() fields: FormField[] = [];
  @Input() initialData: any = {};
  @Input() submitButtonText = 'Save';
  @Input() isSubmitting = false;

  @Output() onSubmit = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    const group: any = {};

    this.fields.forEach(field => {
      const validators = [];
      
      if (field.validators?.required) {
        validators.push(Validators.required);
      }
      if (field.validators?.email) {
        validators.push(Validators.email);
      }
      if (field.validators?.minLength) {
        validators.push(Validators.minLength(field.validators.minLength));
      }
      if (field.validators?.maxLength) {
        validators.push(Validators.maxLength(field.validators.maxLength));
      }
      if (field.validators?.min) {
        validators.push(Validators.min(field.validators.min));
      }
      if (field.validators?.max) {
        validators.push(Validators.max(field.validators.max));
      }

      group[field.key] = [
        this.initialData[field.key] || '',
        validators
      ];
    });

    this.form = this.fb.group(group);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? (field.invalid && field.touched) : false;
  }

  onSubmitForm(): void {
    if (this.form.valid) {
      this.onSubmit.emit(this.form.value);
    } else {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
} 