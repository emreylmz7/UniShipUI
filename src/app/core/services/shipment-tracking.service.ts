import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { ShipmentTracking } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class ShipmentTrackingService extends BaseService<ShipmentTracking> {
  protected override endpoint = 'shipment-trackings';

  constructor(http: HttpClient) {
    super(http);
  }
} 