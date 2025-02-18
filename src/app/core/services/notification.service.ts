import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private nextId = 1;
  notifications = signal<Notification[]>([]);

  show(type: Notification['type'], message: string): void {
    const notification: Notification = {
      id: this.nextId++,
      type,
      message
    };

    this.notifications.update(notifications => [...notifications, notification]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      this.remove(notification.id);
    }, 5000);
  }

  remove(id: number): void {
    this.notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  warning(message: string): void {
    this.show('warning', message);
  }
} 