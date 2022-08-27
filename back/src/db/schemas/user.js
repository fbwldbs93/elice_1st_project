import mongoose, { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: "설명이 아직 없습니다. 추가해 주세요.",
    },
    edu: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    award: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Award",
    },
    certificate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certificate",
    },
    introduction: {
      type: String,
      required: false,
      default: "짧은 자기 소개를 추가해 주세요.",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = model("User", UserSchema);

export { UserModel };
