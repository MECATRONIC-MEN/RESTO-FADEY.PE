/** Clave de acceso a acciones sensibles en Entorno (llaves Render / eliminar licencias). */
export function verifyLicenseAdminGate(password: string): boolean {
  const expected = process.env.LICENSE_ADMIN_GATE_PASSWORD ?? '1475963';
  return password.trim() === expected;
}
