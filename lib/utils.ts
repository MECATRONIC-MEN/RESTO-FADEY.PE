import { WHATSAPP_DEFAULT_MESSAGE, WHATSAPP_NUMBER } from './constants';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getWhatsAppUrl(message?: string): string {
  const encoded = encodeURIComponent(message ?? WHATSAPP_DEFAULT_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
