import mongoose from "mongoose";

const deviceSchema = mongoose.Schema(
  {
    // engineerId: {
    //   type: String,
    //   required: true,
    // },
    engineer: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Engineer",
      required: true,
    },
    deviceName: {
      type: String,
      required: true,
    },
    deviceNumber:{
        type:String,
        requirerd:true,
        unique: true,
    },
    internalNumber:{
        type:Number,
        requierd:true,
        unique: true,
    },
    checks:{
        type:Array,
        default:[]
    },
    status:{
      type: String,
      default: false
    },
    report: {
      type: Boolean,
      default: false
    },
    liveStatus: {
      type: Boolean,
      default: false
    },
  
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);

export default Device;