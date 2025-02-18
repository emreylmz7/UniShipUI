import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;
  isLoading = signal<boolean>(false);

  show(): void {
    this.loadingCount++;
    this.updateLoadingState();
  }

  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.updateLoadingState();
  }

  private updateLoadingState(): void {
    this.isLoading.set(this.loadingCount > 0);
  }
} 