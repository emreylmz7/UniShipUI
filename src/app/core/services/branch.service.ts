import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base.service';
import { Branch } from '../interfaces/models.interface';

@Injectable({
  providedIn: 'root'
})
export class BranchService extends BaseService<Branch> {
  protected override endpoint = 'branchs';

  constructor(http: HttpClient) {
    super(http);
  }
} 