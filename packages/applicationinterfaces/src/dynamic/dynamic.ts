import { PermissionEntity } from './permission-entity';

export class DynamicEntity {
  public userPermissions!: PermissionEntity[];

  public creationDate!: number;
}
