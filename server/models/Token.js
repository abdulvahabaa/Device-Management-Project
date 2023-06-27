import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  revokedTokens:{type:Array,default:[]},
  revokedAdminTokens:{type:Array,default:[]}
});

const JWT_Token = mongoose.model("Token", TokenSchema);

export default JWT_Token;