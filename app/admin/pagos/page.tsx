import { redirect } from 'next/navigation';

/** Alias en español → ruta canónica */
export default function AdminPagosRedirect() {
  redirect('/admin/payments');
}
