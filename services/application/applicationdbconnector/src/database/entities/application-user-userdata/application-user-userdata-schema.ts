import { ApplicationUserUserdata } from '@backend/applicationinterfaces';
import {
    getModelForClass,
    modelOptions,
    Severity,
    prop,
    ReturnModelType,
} from '@typegoose/typegoose';
import { DatabaseEntitySchema } from '../database-entity-schema';

@modelOptions({
    options: {
        customName: 'ApplicationUserUserdata',
        automaticName: false,
        allowMixed: Severity.ALLOW,
    },
})
export class ApplicationUserUserdataSchema extends DatabaseEntitySchema implements ApplicationUserUserdata {
    @prop({
        unique: true,
        required: true,
    })
    public userId!: String;

    @prop({
        unique: false,
        required: true,
        default: {},
        _id: false,
    })
    public userdata?: any;

    public static async createUserdata(this: ReturnModelType<typeof ApplicationUserUserdataSchema>, userId: String, userdata: any) {
        this.create({
            userId,
            userdata,
        });
    }

    public static async getUserDataById(this: ReturnModelType<typeof ApplicationUserUserdataSchema>, userId: String) {
        const userdata = await this.findOne({ userId });

        if (!userdata) {
            return undefined;
        }

        return userdata.userdata;
    }
}

export const ApplicationUserUserdataModel = getModelForClass(ApplicationUserUserdataSchema);
