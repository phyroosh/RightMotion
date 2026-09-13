/**
 * RightMotion Remote Access & Permission System — Types & Enums
 */

const Permissions = Object.freeze({
  VIEW_PROJECTS: 'VIEW_PROJECTS',
  EDIT_PROJECTS: 'EDIT_PROJECTS',
  CREATE_PROJECTS: 'CREATE_PROJECTS',
  DELETE_PROJECTS: 'DELETE_PROJECTS',
  GENERATE: 'GENERATE',
  RENDER: 'RENDER',
  DOWNLOAD: 'DOWNLOAD',
  UPLOAD: 'UPLOAD',
  PUBLISH: 'PUBLISH',
  MANAGE_INVITES: 'MANAGE_INVITES',
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
  REMOTE_ACCESS_CONTROL: 'REMOTE_ACCESS_CONTROL',
});

const ALL_PERMISSIONS = Object.freeze(Object.values(Permissions));

// Default permissions for newly created visitors if not customized
const DEFAULT_VISITOR_PERMISSIONS = Object.freeze([
  Permissions.VIEW_PROJECTS,
  Permissions.EDIT_PROJECTS,
  Permissions.GENERATE,
  Permissions.RENDER,
  Permissions.DOWNLOAD,
]);

// Explicitly dangerous permissions that should never be enabled by default
const DANGEROUS_PERMISSIONS = Object.freeze([
  Permissions.UPLOAD,
  Permissions.PUBLISH,
  Permissions.MANAGE_INVITES,
  Permissions.MANAGE_SETTINGS,
  Permissions.REMOTE_ACCESS_CONTROL,
]);

const InviteStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  REVOKED: 'REVOKED',
  EXPIRED: 'EXPIRED',
});

const Roles = Object.freeze({
  OWNER: 'OWNER',
  VISITOR: 'VISITOR',
});

module.exports = {
  Permissions,
  ALL_PERMISSIONS,
  DEFAULT_VISITOR_PERMISSIONS,
  DANGEROUS_PERMISSIONS,
  InviteStatus,
  Roles,
};
