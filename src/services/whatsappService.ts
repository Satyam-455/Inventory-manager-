export const whatsappService = {
  /**
   * Service interface boundary for WhatsApp Business API integration.
   * Generates click-to-chat links or handles webhook payload creation.
   */
  generateInvoiceShareLink(phone: string, invoiceNumber: string, amount: number): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello! Your battery purchase receipt (${invoiceNumber}) for ₹${amount} is available. Thank you for choosing PowerDrive Battery Solutions!`
    );
    return `https://wa.me/91${cleanPhone}?text=${text}`;
  }
};
