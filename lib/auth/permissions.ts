import type { UserRole } from './types';

/** Permisos por rol — base para RBAC futuro */
export const PERMISSIONS = {
  manageUsers: ['master_admin'],
  manageContent: ['master_admin'],
  managePlans: ['master_admin'],
  managePromotions: ['master_admin'],
  uploadVideos: ['master_admin'],
  viewStats: ['master_admin'],
  publishAnnouncements: ['master_admin'],
  modifyEnvironment: ['master_admin'],
  viewDashboard: ['master_admin', 'cliente', 'observador'],
  viewBenefits: ['master_admin', 'cliente', 'observador'],
  viewPromotions: ['master_admin', 'cliente', 'observador'],
  viewAcademy: ['master_admin', 'cliente', 'observador'],
  viewVideos: ['master_admin', 'cliente', 'observador'],
  viewCourses: ['master_admin', 'cliente', 'observador'],
  viewResources: ['master_admin', 'cliente', 'observador'],
  viewNews: ['master_admin', 'cliente', 'observador'],
  editContent: ['master_admin'],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return (PERMISSIONS[permission] as readonly UserRole[]).includes(role);
}

export function isReadOnly(role: UserRole): boolean {
  return role === 'observador' || role === 'cliente';
}

export function isMasterAdmin(role: UserRole): boolean {
  return role === 'master_admin';
}
