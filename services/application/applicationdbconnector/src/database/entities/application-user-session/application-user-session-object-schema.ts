import { ApplicationUserSessionObject } from '@backend/applicationinterfaces';
import { modelOptions, Severity, prop } from '@typegoose/typegoose';

@modelOptions({
    options: {
        customName: 'ApplicationUserSessionObject',
        automaticName: false,
        allowMixed: Severity.ALLOW,
    },
})
export class ApplicationUserSessionObjectSchema implements ApplicationUserSessionObject {
    @prop({
        unique: false,
        required: false,
        sparse: true,
    })
    public cookie?: any;

    @prop({
        unique: false,
        required: false,
        sparse: true,
    })
    public passport?: any;

    @prop({
        unique: false,
        required: false,
        sparse: true,
    })
    public pushDeviceToken?: string;
}
