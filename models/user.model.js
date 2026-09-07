import mongoose, { Mongoose } from "mongoose";
import { Schema } from "mongoose";
import bcrypt from 'bcrypt'
const userSchema = new Schema(
  {
    name: {
      type: String,
       minLength: [5, "name must be greater then 5"],
        maxLength: [10, "name should not greater than 10"],
        trim: true,
        required:[true , 'Name must be required']
    },
    slug: { type: String, lowercase: true },

    email: {
      type: String,
      required: [true, "Email must be required"],
      trim: true,
      unique: true,
      lowercase: true,
    },
    phone: String,
    imgProfile: String,

    isActive: { type: Boolean, default: true },
    changePasswordAt:Date,
    resetPasswordAt:Date,

    resetCode : String,
    resetCodeExpired: Date,
    resetCodeVerified: Boolean,
    password: {
      type: String,
      required: [true, "Password is required !"],
      minLength: [6, "Password is too short"],
      select: false,
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save' , async function (next)
{
  if(!this.isModified("password")) return ;

   this.password = await bcrypt.hash(this.password , 12)
})

export default mongoose.model("User", userSchema);
