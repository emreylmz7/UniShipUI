import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BranchService } from '../../../../core/services/branch.service';
import { Branch } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-branch-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="branch-details">
      <div class="page-header">
        <h1>Branch Details</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="onEdit()">Edit</button>
          <button class="btn btn-danger" (click)="onDelete()">Delete</button>
        </div>
      </div>

      <div class="details-card" *ngIf="branch">
        <div class="detail-content">
          <div class="detail-item">
            <label>Name</label>
            <span>{{ branch.name }}</span>
          </div>
          <div class="detail-item">
            <label>Address</label>
            <span>{{ branch.address }}</span>
          </div>
          <div class="detail-item">
            <label>Phone</label>
            <span>{{ branch.phone }}</span>
          </div>
          <div class="detail-item">
            <label>Email</label>
            <span>{{ branch.email }}</span>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <span class="status-badge" [class.active]="branch.isActive">
              {{ branch.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .branch-details {
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
      background-color: #dc3545;
      color: white;

      &.active {
        background-color: #28a745;
      }
    }
  `]
})
export class BranchDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private branchService = inject(BranchService);
  private notificationService = inject(NotificationService);

  branch: Branch | null = null;

  ngOnInit(): void {
    const branchId = this.route.snapshot.params['id'];
    this.loadBranch(branchId);
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

  onEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete(): void {
    if (this.branch && confirm('Are you sure you want to delete this branch?')) {
      this.branchService.delete(this.branch.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Branch deleted successfully');
            this.router.navigate(['/branches']);
          }
        },
        error: (error) => {
          console.error('Error deleting branch:', error);
          this.notificationService.error('Failed to delete branch');
        }
      });
    }
  }
} 