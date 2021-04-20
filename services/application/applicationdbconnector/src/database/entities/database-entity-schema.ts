import { prop } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { DatabaseEntity } from '@backend/applicationinterfaces';

export class DatabaseEntitySchema implements DatabaseEntity {
    @prop({
        type: mongoose.Types.ObjectId,
        default: () => {
            return new mongoose.Types.ObjectId();
        },
    })
    public _id?: mongoose.Types.ObjectId = new mongoose.Types.ObjectId();

    @prop({
        type: Number,
        required: true,
        unique: false,
        default: () => {
            return Date.now();
        },
    })
    public creationDate?: number = Date.now();

    @prop({
        type: Number,
        required: true,
        default: 0,
    })
    public __v?: number = 0;
}
