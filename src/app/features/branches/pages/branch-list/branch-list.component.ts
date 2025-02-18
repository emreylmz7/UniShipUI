import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTableComponent, Column } from '../../../../shared/components/data-table/data-table.component';
import { BranchService } from '../../../../core/services/branch.service';
import { Branch } from '../../../../core/interfaces/models.interface';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-branch-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DataTableComponent],
  template: `
    <div class="branch-list">
      <div class="page-header">
        <h1>Branches</h1>
        <button class="btn btn-primary" routerLink="new">Create New Branch</button>
      </div>

      <app-data-table
        [columns]="columns"
        [data]="branches"
        (onEdit)="onEdit($event)"
        (onDelete)="onDelete($event)"
      ></app-data-table>
    </div>
  `,
  styles: [`
    .branch-list {
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
export class BranchListComponent implements OnInit {
  private branchService = inject(BranchService);
  private notificationService = inject(NotificationService);
  
  branches: Branch[] = [];
  
  columns: Column[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'phone', label: 'Phone', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'isActive', label: 'Status', sortable: true, 
      format: (value) => value ? 'Active' : 'Inactive' }
  ];

  ngOnInit(): void {
    this.loadBranches();
  }

  private loadBranches(): void {
    this.branchService.getAll().subscribe({
      next: (response) => {
        if (response.isSuccessful && response.data) {
          this.branches = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading branches:', error);
        this.notificationService.error('Failed to load branches');
      }
    });
  }

  onEdit(branch: Branch): void {
    window.location.href = `/branches/${branch.id}/edit`;
  }

  onDelete(branch: Branch): void {
    if (confirm('Are you sure you want to delete this branch?')) {
      this.branchService.delete(branch.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.notificationService.success('Branch deleted successfully');
            this.loadBranches();
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