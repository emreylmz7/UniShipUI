import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Customer } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {
  protected override endpoint = 'customers';

  constructor(http: HttpClient) {
    super(http);
  }
} 