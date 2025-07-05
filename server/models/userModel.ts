import { model, Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt'

const saltRounds = 12

export interface IUser extends Document<Types.ObjectId> {
    email: string;
    password: string;
    name: string;
    role: 'driver' | 'customer';
    rides: Types.ObjectId[];
    correctPassword: (candidatePassword: string) => Promise<boolean>;


}

const userSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['driver', 'customer'],
            default: "customer"

        },
        name: { type: String, required: true },
        rides: [
            { type: Schema.Types.ObjectId, ref: 'Ride', default: [] },
        ],
    },
    {
        toObject: { virtuals: true },
        toJSON: {
            virtuals: true,
            transform(doc, ret, options) {
                // Remove passwordHash from any JSON response
                delete ret.password;
                return ret;
            },
        },
    },
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});


userSchema.methods.correctPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// prettier-ignore
const UserModel = model('User', userSchema);
export default UserModel