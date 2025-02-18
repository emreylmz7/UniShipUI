import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  format?: (value: any) => string;
}

export interface SortEvent {
  column: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-container">
      <div class="table-actions">
        <div class="search-box">
          <input
            type="text"
            [ngModel]="searchTerm()"
            (ngModelChange)="onSearch($event)"
            placeholder="Search..."
            class="search-input"
          />
        </div>
        <div class="items-per-page">
          <select [ngModel]="pageSize()" (ngModelChange)="onPageSizeChange($event)" class="page-size-select">
            <option [value]="5">5 per page</option>
            <option [value]="10">10 per page</option>
            <option [value]="20">20 per page</option>
            <option [value]="50">50 per page</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th *ngFor="let col of columns" [class.sortable]="col.sortable" (click)="col.sortable && sort(col.key)">
                {{ col.label }}
                <span *ngIf="col.sortable" class="sort-icon">
                  {{ getSortIcon(col.key) }}
                </span>
              </th>
              <th *ngIf="showActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of paginatedData()">
              <td *ngFor="let col of columns">
                {{ col.format ? col.format(item[col.key]) : item[col.key] }}
              </td>
              <td *ngIf="showActions" class="actions-cell">
                <button class="btn btn-edit" (click)="onEdit.emit(item)">Edit</button>
                <button class="btn btn-delete" (click)="onDelete.emit(item)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="totalPages() > 1">
        <button
          class="btn btn-page"
          [disabled]="currentPage() === 1"
          (click)="onPageChange(currentPage() - 1)"
        >
          Previous
        </button>
        
        <span class="page-info">
          Page {{ currentPage() }} of {{ totalPages() }}
        </span>
        
        <button
          class="btn btn-page"
          [disabled]="currentPage() === totalPages()"
          (click)="onPageChange(currentPage() + 1)"
        >
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .data-table-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem;
    }

    .table-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .search-input {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 200px;
    }

    .page-size-select {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      
      th, td {
        padding: 1rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      th {
        background-color: #f8f9fa;
        font-weight: 600;
        
        &.sortable {
          cursor: pointer;
          
          &:hover {
            background-color: #e9ecef;
          }
        }
      }

      tr:hover {
        background-color: #f8f9fa;
      }
    }

    .sort-icon {
      margin-left: 0.5rem;
      font-size: 0.8rem;
    }

    .actions-cell {
      white-space: nowrap;
      
      .btn {
        margin-right: 0.5rem;
        
        &:last-child {
          margin-right: 0;
        }
      }
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-edit {
      background-color: #007bff;
      color: white;

      &:hover:not(:disabled) {
        background-color: #0056b3;
      }
    }

    .btn-delete {
      background-color: #dc3545;
      color: white;

      &:hover:not(:disabled) {
        background-color: #c82333;
      }
    }

    .btn-page {
      background-color: #6c757d;
      color: white;

      &:hover:not(:disabled) {
        background-color: #5a6268;
      }
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
      gap: 1rem;
    }

    .page-info {
      font-size: 0.9rem;
      color: #6c757d;
    }
  `]
})
export class DataTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() showActions = true;

  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<SortEvent>();

  searchTerm = signal<string>('');
  currentPage = signal<number>(1);
  pageSize = signal<number>(10);
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');

  filteredData = computed(() => {
    let filtered = [...this.data];
    const term = this.searchTerm().toLowerCase();

    if (term) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    if (this.sortColumn()) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortColumn()];
        const bVal = b[this.sortColumn()];
        
        if (aVal === bVal) return 0;
        
        const comparison = aVal > bVal ? 1 : -1;
        return this.sortDirection() === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  });

  totalPages = computed(() => 
    Math.ceil(this.filteredData().length / this.pageSize())
  );

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredData().slice(start, end);
  });

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageSizeChange(size: number): void {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  sort(column: string): void {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }

    this.onSort.emit({
      column,
      direction: this.sortDirection()
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn() !== column) return '↕️';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }
} 