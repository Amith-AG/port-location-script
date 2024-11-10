import mongoose, { Schema } from "mongoose";

const PortSchema = new Schema(
  {
    port_code: {
      type: String,
      required: true,
    },
    port_name: {
      type: String,
      required: true,
    },
    port_type: {
      type: String,
      required: true,
    },
    location: {
      type: { type: String, default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  {
    collection: "test",
  }
);
const ports = mongoose.models.test || mongoose.model("test", PortSchema);
export default ports;
