export interface NotificationPayload {
  recipientPhone: string;
  recipientName: string;
  templateType: 'WARRANTY_EXPIRY' | 'SALE_RECEIPT' | 'PROMO_OFFER';
  metadata: Record<string, any>;
}

export const notificationService = {
  /**
   * Service interface placeholder for FCM / SMS / Push Notifications.
   * Notifications are OUT OF SCOPE for v1, but this interface provides
   * the clean boundary for future service workers or push drivers.
   */
  async sendNotification(payload: NotificationPayload): Promise<{ success: boolean; messageId: string }> {
    console.log('[NotificationService Stub] Payload queued for future dispatch:', payload);
    return {
      success: true,
      messageId: `msg_${Date.now()}`
    };
  }
};
