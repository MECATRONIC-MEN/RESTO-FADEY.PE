import { DEMO_CLIENT_ID } from '@/lib/demo';
import { clearMockOperationalData } from '@/lib/domain/mock-store';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';
const CONFIRM_PHRASE = 'REINICIAR';

export type DataResetOptions = {
  confirm: string;
  includeLeadsAndNotifications?: boolean;
  removeTestClients?: boolean;
};

export type DataResetResult = {
  deleted: {
    payments: number;
    adminNotifications: number;
    leads: number;
    demoRequests: number;
    clients: number;
  };
  message: string;
};

async function deleteAllFromTable(table: string): Promise<number> {
  const db = getSupabaseAdmin()!;
  const { count, error } = await db
    .from(table)
    .delete({ count: 'exact' })
    .neq('id', ZERO_UUID);

  if (error) {
    if (error.message.includes('does not exist') || error.code === '42P01') {
      return 0;
    }
    throw new Error(`${table}: ${error.message}`);
  }
  return count ?? 0;
}

export async function resetOperationalData(options: DataResetOptions): Promise<DataResetResult> {
  if (options.confirm.trim().toUpperCase() !== CONFIRM_PHRASE) {
    throw new Error(`Escriba ${CONFIRM_PHRASE} para confirmar`);
  }

  const includeLeads = options.includeLeadsAndNotifications !== false;
  const removeTestClients = options.removeTestClients === true;

  if (!isSupabaseConfigured()) {
    const mock = clearMockOperationalData({ removeTestClients });
    return {
      deleted: {
        payments: mock.payments,
        adminNotifications: 0,
        leads: 0,
        demoRequests: 0,
        clients: mock.clients,
      },
      message: 'Datos de prueba reiniciados (modo local sin Supabase).',
    };
  }

  const db = getSupabaseAdmin()!;
  const deleted = {
    payments: 0,
    adminNotifications: 0,
    leads: 0,
    demoRequests: 0,
    clients: 0,
  };

  deleted.payments = await deleteAllFromTable('payments');

  await db
    .from('clients')
    .update({
      payment_status: null,
      pos_connection_status: 'unknown',
      pos_last_seen_at: null,
    })
    .neq('id', ZERO_UUID);

  if (includeLeads) {
    deleted.adminNotifications = await deleteAllFromTable('admin_notifications');
    deleted.leads = await deleteAllFromTable('leads');
    deleted.demoRequests = await deleteAllFromTable('demo_requests');
  }

  if (removeTestClients) {
    const { count, error } = await db
      .from('clients')
      .delete({ count: 'exact' })
      .neq('id', DEMO_CLIENT_ID);
    if (error) throw new Error(`clients: ${error.message}`);
    deleted.clients = count ?? 0;
  }

  const parts = [`${deleted.payments} pagos eliminados`];
  if (includeLeads) {
    parts.push(
      `${deleted.leads} leads`,
      `${deleted.demoRequests} demos`,
      `${deleted.adminNotifications} notificaciones`
    );
  }
  if (removeTestClients && deleted.clients > 0) {
    parts.push(`${deleted.clients} clientes de prueba`);
  }

  return {
    deleted,
    message: `Reinicio completado: ${parts.join(', ')}. Usuarios, planes y APIs sin cambios.`,
  };
}

export { CONFIRM_PHRASE };
