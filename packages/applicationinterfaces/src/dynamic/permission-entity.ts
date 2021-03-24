import { Permission } from './permission';

export class PermissionEntity {
  public userId!: string;

  public permissions!: Permission[];
}
