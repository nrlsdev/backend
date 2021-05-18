export class ApplicationUserUserdataEntity {
    private static instance: ApplicationUserUserdataEntity;

    private constructor() {
        // Empty constructor
    }

    public static get Instance() {
        return ApplicationUserUserdataEntity.instance || new ApplicationUserUserdataEntity();
    }
}
