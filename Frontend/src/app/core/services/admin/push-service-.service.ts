import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PushService {
  constructor(private http: HttpClient) { }

  subscribeToNotifications() {
    if (Notification.permission === 'denied') {
      console.warn("❌ El usuario ha bloqueado las notificaciones.");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission !== 'granted') {
        console.warn("❌ Permiso de notificaciones no concedido.");
        return;
      }

      navigator.serviceWorker.ready.then(async registration => {
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
          await existingSubscription.unsubscribe();
        }

        const vapidKey = 'BBhWfccyHHvU-DrbPbbMMOeaQ3_xMZGQhPR1FfwIfeShYsGnUO6J-iP6C-fkfbtIC1DCqOm6KBru77UkBjkmyvA=';
        const newSubscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
        });

        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`
        });

        this.http.post(`${environment.API_URI}/api/save-subscription/`, newSubscription, { headers })
          .subscribe({
            next: () => console.log('✅ Subscripción guardada'),
            error: err => console.error('❌ Error al guardar subscripción', err)
          });
      });
    });
  }

  deleteSubscriptionFromBackend(subscription: PushSubscription) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${environment.API_URI}/api/delete-subscription/`, {
      headers,
      body: { endpoint: subscription.endpoint }
    });
  }


  unsubscribeNotifications() {
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        if (subscription && subscription.endpoint) {
          // 1. Eliminar en el navegador
          subscription.unsubscribe().then(() => {
            console.log("🔁 Subscripción eliminada localmente");
  
            // 2. Eliminar en el backend
            const token = localStorage.getItem('token');
            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`
            });
  
            // Verifica si el endpoint existe antes de intentar eliminar
            if (subscription.endpoint) {
              this.http.delete(`${environment.API_URI}/api/delete-subscription/`, {
                headers,
                body: { endpoint: subscription.endpoint }
              }).subscribe({
                next: () => {
                  console.log("🧹 Subscripción eliminada en el backend");
                  this.subscribeToNotifications();
                },
                error: err => {
                  console.error("❌ Error eliminando subscripción en backend", err);
                  this.subscribeToNotifications();
                }
              });
            }
  
          }).catch(err => {
            console.error("❌ Error al eliminar subscripción en navegador", err);
            this.subscribeToNotifications();
          });
  
        } else {
          console.log("🔕 No hay subscripción activa");
          this.subscribeToNotifications();
        }
      });
    });
  }  
  

  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
  }

}
