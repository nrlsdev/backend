import { findObjectFromArray } from '../object';
import { Permission } from './permission';

export class PermissionEntity {
  public userId!: string;

  public permissions!: Permission[];

  public static isUserPermitted(userPermissions: PermissionEntity[], userId: string, ...permissions: Permission[]) {
    const objects = findObjectFromArray('userId', userId, userPermissions);
    let haveAllPermissions: boolean = objects.length > 0;

    objects.forEach((object) => {
      permissions.forEach((permission: Permission) => {
        if (!object.permissions.includes(permission)) {
          haveAllPermissions = false;
        }
      });
    });

    return haveAllPermissions;
  }
}
