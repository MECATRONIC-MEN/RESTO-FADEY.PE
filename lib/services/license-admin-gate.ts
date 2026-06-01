/** Clave de acceso a acciones sensibles en Licencias (llaves Render / eliminar). */
export function verifyLicenseAdminGate(password: string): boolean {
  const expected = process.env.LICENSE_ADMIN_GATE_PASSWORD ?? '1475963';
  return password.trim() === expected;
}
