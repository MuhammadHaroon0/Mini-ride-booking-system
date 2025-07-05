import { Schema, model, Document, Types } from 'mongoose';

export interface IRide extends Document<Types.ObjectId> {
    pickupLocation: string;
    dropOffLocation: string;
    rideType: string;
    status: string;
    proposedFare: number
    createdAt?: Date;
    updatedAt?: Date;
    user: Types.ObjectId;
}

const rideSchema = new Schema<IRide>(
    {
        pickupLocation: { type: String, required: true },
        dropOffLocation: { type: String, required: true },
        rideType: {
            type: String,
            required: true,
            enum: ['car', "bike", "rickshaw"],
            message: "Invalid rideType!"
        },
        proposedFare: { type: Number, required: true },
        status: {
            type: String,
            enum: ['completed', "in_progress", "accepted", "requested"],
            message: "Invalid status!"
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
);

const RideModel = model('Ride', rideSchema);

export default RideModel