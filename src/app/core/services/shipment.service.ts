import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Shipment } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService extends BaseService<Shipment> {
  protected override endpoint = 'shipments';

  constructor(http: HttpClient) {
    super(http);
  }
} 