import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Vehicle } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends BaseService<Vehicle> {
  protected override endpoint = 'vehicles';

  constructor(http: HttpClient) {
    super(http);
  }
} 