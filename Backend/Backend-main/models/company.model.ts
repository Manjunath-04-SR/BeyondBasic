import mongoose from "mongoose";

const roundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: String, default: "" },
    tips: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const hiringDetailsSchema = new mongoose.Schema(
  {
    ctc: { type: String, default: "" },
    roles: [{ type: String }],
    eligibility: { type: String, default: "" },
    locations: [{ type: String }],
    bond: { type: String, default: "" },
    selectionRate: { type: String, default: "" },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logo: { type: String, default: "" },
    type: {
      type: String,
      enum: ["Service", "Product", "Startup", "Consulting", "FAANG"],
      default: "Service",
    },
    color: { type: String, default: "bg-blue-600" },
    badge: { type: String, default: "" },
    badgeColor: { type: String, default: "bg-slate-50 text-slate-700 border-slate-100" },
    website: { type: String, default: "" },
    description: { type: String, default: "" },
    overview: { type: String, default: "" },
    hiringProcess: { type: String, default: "" },
    hiringDetails: { type: hiringDetailsSchema, default: () => ({}) },
    rounds: [roundSchema],
    isPublished: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);
export default Company;
