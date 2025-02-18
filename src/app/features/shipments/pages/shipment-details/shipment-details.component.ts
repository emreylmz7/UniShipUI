import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin, map } from 'rxjs';
import { ShipmentService } from '../../../../core/services/shipment.service';
import { CustomerService } from '../../../../core/services/customer.service';
import { BranchService } from '../../../../core/services/branch.service';
import { ShipmentTrackingService } from '../../../../core/services/shipment-tracking.service';
import { Shipment, Customer, Branch, ShipmentTracking } from '../../../../core/interfaces/models.interface';

interface RelatedData {
  sender: Customer;
  receiver: Customer;
  sourceBranch: Branch;
  destinationBranch: Branch;
}

@Component({
  selector: 'app-shipment-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="shipment-details">
      <div class="page-header">
        <h1>Shipment Details</h1>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="onEdit()">Edit</button>
          <button class="btn btn-danger" (click)="onDelete()">Delete</button>
        </div>
      </div>

      <div class="details-grid">
        <div class="detail-card">
          <h2>General Information</h2>
          <div class="detail-content">
            <div class="detail-item">
              <label>Status</label>
              <span class="status-badge" [class]="'status-' + shipment?.status?.toLowerCase()">
                {{ shipment?.status }}
              </span>
            </div>
            <div class="detail-item">
              <label>Content</label>
              <span>{{ shipment?.content }}</span>
            </div>
            <div class="detail-item">
              <label>Weight</label>
              <span>{{ shipment?.weight }} kg</span>
            </div>
            <div class="detail-item">
              <label>Dimensions</label>
              <span>{{ shipment?.dimensions?.length }}x{{ shipment?.dimensions?.width }}x{{ shipment?.dimensions?.height }} cm</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h2>Sender Information</h2>
          <div class="detail-content">
            <div class="detail-item">
              <label>Name</label>
              <span>{{ sender?.name }} {{ sender?.surname }}</span>
            </div>
            <div class="detail-item">
              <label>Email</label>
              <span>{{ sender?.email }}</span>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <span>{{ sender?.phone }}</span>
            </div>
            <div class="detail-item">
              <label>Address</label>
              <span>{{ sender?.address }}</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h2>Receiver Information</h2>
          <div class="detail-content">
            <div class="detail-item">
              <label>Name</label>
              <span>{{ receiver?.name }} {{ receiver?.surname }}</span>
            </div>
            <div class="detail-item">
              <label>Email</label>
              <span>{{ receiver?.email }}</span>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <span>{{ receiver?.phone }}</span>
            </div>
            <div class="detail-item">
              <label>Address</label>
              <span>{{ receiver?.address }}</span>
            </div>
          </div>
        </div>

        <div class="detail-card">
          <h2>Branch Information</h2>
          <div class="detail-content">
            <div class="detail-item">
              <label>Source Branch</label>
              <span>{{ sourceBranch?.name }}</span>
            </div>
            <div class="detail-item">
              <label>Source Branch Address</label>
              <span>{{ sourceBranch?.address }}</span>
            </div>
            <div class="detail-item">
              <label>Destination Branch</label>
              <span>{{ destinationBranch?.name }}</span>
            </div>
            <div class="detail-item">
              <label>Destination Branch Address</label>
              <span>{{ destinationBranch?.address }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="tracking-section">
        <h2>Tracking History</h2>
        <div class="tracking-timeline">
          <div *ngFor="let track of trackingHistory" class="tracking-item">
            <div class="tracking-status" [class]="'status-' + track.status.toLowerCase()">
              {{ track.status }}
            </div>
            <div class="tracking-info">
              <div class="tracking-location">{{ track.location }}</div>
              <div class="tracking-notes">{{ track.notes }}</div>
              <div class="tracking-time">{{ track.timestamp | date:'medium' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shipment-details {
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

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .detail-card {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      h2 {
        margin: 0 0 1rem;
        color: #2c3e50;
        font-size: 1.25rem;
      }
    }

    .detail-content {
      display: grid;
      gap: 1rem;
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
        font-weight: 500;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-in-transit {
        background: #cce5ff;
        color: #004085;
      }

      &.status-delivered {
        background: #d4edda;
        color: #155724;
      }

      &.status-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .tracking-section {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-top: 2rem;

      h2 {
        margin: 0 0 1.5rem;
        color: #2c3e50;
      }
    }

    .tracking-timeline {
      display: grid;
      gap: 1.5rem;
    }

    .tracking-item {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 1rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e9ecef;

      &:last-child {
        padding-bottom: 0;
        border-bottom: none;
      }
    }

    .tracking-status {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      text-align: center;
      white-space: nowrap;

      &.status-pending {
        background: #fff3cd;
        color: #856404;
      }

      &.status-in-transit {
        background: #cce5ff;
        color: #004085;
      }

      &.status-delivered {
        background: #d4edda;
        color: #155724;
      }

      &.status-cancelled {
        background: #f8d7da;
        color: #721c24;
      }
    }

    .tracking-info {
      .tracking-location {
        font-weight: 500;
        color: #2c3e50;
        margin-bottom: 0.25rem;
      }

      .tracking-notes {
        color: #6c757d;
        margin-bottom: 0.25rem;
      }

      .tracking-time {
        font-size: 0.875rem;
        color: #6c757d;
      }
    }
  `]
})
export class ShipmentDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private shipmentService = inject(ShipmentService);
  private customerService = inject(CustomerService);
  private branchService = inject(BranchService);
  private trackingService = inject(ShipmentTrackingService);

  shipment: Shipment | null = null;
  sender: Customer | null = null;
  receiver: Customer | null = null;
  sourceBranch: Branch | null = null;
  destinationBranch: Branch | null = null;
  trackingHistory: ShipmentTracking[] = [];

  ngOnInit(): void {
    const shipmentId = this.route.snapshot.params['id'];
    this.loadShipmentDetails(shipmentId);
  }

  private loadShipmentDetails(shipmentId: string): void {
    forkJoin({
      shipment: this.shipmentService.getById(shipmentId),
      tracking: this.trackingService.getAll()
    }).pipe(
      map(data => ({
        shipment: data.shipment.data,
        tracking: data.tracking.data?.filter(t => t.shipmentId === shipmentId) || []
      }))
    ).subscribe({
      next: (data) => {
        if (data.shipment) {
          this.shipment = data.shipment;
          this.trackingHistory = data.tracking.sort((a, b) => 
            new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
          );
          
          // Load related data
          this.loadRelatedData(data.shipment);
        }
      },
      error: (error) => {
        console.error('Error loading shipment details:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  private loadRelatedData(shipment: Shipment): void {
    forkJoin({
      sender: this.customerService.getById(shipment.senderId),
      receiver: this.customerService.getById(shipment.receiverId),
      sourceBranch: this.branchService.getById(shipment.sourceBranchId),
      destinationBranch: this.branchService.getById(shipment.destinationBranchId)
    }).pipe(
      map(data => ({
        sender: data.sender.data!,
        receiver: data.receiver.data!,
        sourceBranch: data.sourceBranch.data!,
        destinationBranch: data.destinationBranch.data!
      } as RelatedData))
    ).subscribe({
      next: (data) => {
        this.sender = data.sender;
        this.receiver = data.receiver;
        this.sourceBranch = data.sourceBranch;
        this.destinationBranch = data.destinationBranch;
      },
      error: (error) => {
        console.error('Error loading related data:', error);
        // TODO: Add error handling/notification
      }
    });
  }

  onEdit(): void {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  onDelete(): void {
    if (this.shipment && confirm('Are you sure you want to delete this shipment?')) {
      this.shipmentService.delete(this.shipment.id!).subscribe({
        next: (response) => {
          if (response.isSuccessful) {
            this.router.navigate(['/shipments']);
          }
        },
        error: (error) => {
          console.error('Error deleting shipment:', error);
          // TODO: Add error handling/notification
        }
      });
    }
  }
} 