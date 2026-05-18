import { Mail, Phone, MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';
import { getWhatsAppUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ContactInfoProps {
  className?: string;
  showLabels?: boolean;
}

const items = [
  {
    icon: Mail,
    label: 'Correo electrónico',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    external: false,
  },
  {
    icon: Phone,
    label: 'Teléfono',
    value: CONTACT.phoneDisplay,
    href: `tel:${CONTACT.phoneTel}`,
    external: false,
  },
  {
    icon: MessageCircle,
    label: 'Facebook Messenger',
    value: CONTACT.messengerLabel,
    href: CONTACT.messengerUrl,
    external: true,
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    href: getWhatsAppUrl(),
    external: true,
    accent: 'green' as const,
  },
];

export function ContactInfo({ className, showLabels = true }: ContactInfoProps) {
  return (
    <ul className={cn('space-y-5', className)}>
      {items.map((item) => {
        const Icon = item.icon;
        const isGreen = item.accent === 'green';
        return (
          <li key={item.label}>
            <a
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={cn(
                'group flex items-start gap-4 transition-colors',
                isGreen ? 'hover:text-brand-green' : 'hover:text-brand-blue'
              )}
            >
              <div
                className={cn(
                  'rounded-lg p-3',
                  isGreen ? 'bg-brand-green/10' : 'bg-brand-blue/10'
                )}
              >
                <Icon
                  className={cn('h-5 w-5', isGreen ? 'text-brand-green' : 'text-brand-blue')}
                />
              </div>
              <div>
                {showLabels && <p className="text-sm text-gray-500">{item.label}</p>}
                <p className="font-medium text-white group-hover:underline">{item.value}</p>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
