const { model, Schema } = require("mongoose");
const { createHmac, randomBytes } = require("node:crypto"); // used to hashed the password
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      reuired: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    salt: {
      type: String
    },
    profileImageURl: {
      type: String,
      default: "/images/default.jpg"
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER"
    }
  },
  { timestamps: true }
);

// When we save the user then how to middleware are works
// Basically how to hashed the password
// Schema pre Save

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) {
    return;
  }
  // hashed the password

  const salt = randomBytes(16).toString();

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

// create a own static methopd
userSchema.static("passwordMatcher", async function(email, password) {
  // to find user using email
  const user = await this.findOne({ email });
  // if the user is not find then throw error
  if (!user) {
    throw new Error("User not found!");
  }

  const salt = user.salt;
  const hashedPassword = user.password;

  // now hashed the user provided password
  const userProvidedHash = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  // to check userProvidedPassword and hashedPassWord are same or  not

  if (userProvidedHash !== hashedPassword) {
    throw new Error("passWord Incorrect");
  }

  return {
    ...user,
    password: undefined,
    salt: undefined
  };
});
const User = model("user", userSchema);
module.exports = User;
