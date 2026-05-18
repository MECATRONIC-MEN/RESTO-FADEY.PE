import { WHATSAPP_NUMBER } from './constants';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getWhatsAppUrl(message?: string): string {
  const encoded = encodeURIComponent(
    message ?? 'Hola, me interesa conocer Resto Fadey para mi restaurante.'
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
