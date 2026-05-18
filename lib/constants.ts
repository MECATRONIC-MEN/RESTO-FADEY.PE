export const SITE_URL = 'https://restofadey.pe';
export const SITE_NAME = 'Resto Fadey';

/** Información de contacto oficial */
export const CONTACT = {
  email: 'restofadey@gmail.com',
  phoneDisplay: '+51 935 968 198',
  phoneTel: '+51935968198',
  whatsapp: '51935968198',
  messengerLabel: 'Resto Fadey.app',
  messengerUrl: 'https://www.facebook.com/share/1abiKsSRMD/',
  facebookUrl: 'https://www.facebook.com/share/1abiKsSRMD/',
  location: 'Perú',
} as const;

export const WHATSAPP_NUMBER = CONTACT.whatsapp;
export const WHATSAPP_MESSAGE = encodeURIComponent(
  'Hola, me interesa conocer Resto Fadey para mi restaurante.'
);

export const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#beneficios', label: 'Beneficios' },
  { href: '#galeria', label: 'Galería' },
  { href: '#planes', label: 'Planes' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contacto', label: 'Contacto' },
] as const;

export const SOCIAL_LINKS = [
  { href: CONTACT.facebookUrl, label: 'Facebook', icon: 'facebook' as const },
  { href: CONTACT.messengerUrl, label: 'Messenger', icon: 'messenger' as const },
] as const;

export const FUTURE_ROUTES = [
  { href: '/planes', label: 'Planes' },
  { href: '/demo', label: 'Demo' },
  { href: '/contacto', label: 'Contacto' },
  { href: '/blog', label: 'Blog' },
] as const;
