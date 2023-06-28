import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({

  engineerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Engineer",
    required: true,
  },
  
  revokedTokens: { type: Array, default: [] },
 
});

const JWT_Token = mongoose.model("Token", TokenSchema);

export default JWT_Token;
