import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private http = inject(HttpClient);

  async subscribe(subscription: PushSubscriptionJSON): Promise<void> {
    const keys = subscription.keys as { p256dh: string; auth: string };
    await firstValueFrom(this.http.post('/api/notifications/subscribe', {
      endpoint: subscription.endpoint,
      keys: { p256dh: keys.p256dh, auth: keys.auth }
    }));
  }

  async unsubscribe(endpoint: string): Promise<void> {
    await firstValueFrom(this.http.delete('/api/notifications/subscribe', { body: { endpoint } }));
  }
}
