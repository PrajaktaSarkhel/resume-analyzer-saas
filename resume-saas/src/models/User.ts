import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

// Define the User interface
interface IUser extends Document {
  email: string;
  password: string;
  plan: "FREE" | "PRO";
  resumeCredits: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the User model type
interface IUserModel extends Model<IUser> {}

// Create the schema
const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    plan: {
      type: String,
      enum: ["FREE", "PRO"],
      default: "FREE",
    },
    resumeCredits: {
      type: Number,
      default: 3,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the model
const User = mongoose.models.User || mongoose.model<IUser, IUserModel>("User", UserSchema);

export default User;
