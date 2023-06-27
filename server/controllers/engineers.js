import Engineer from "../models/Engineers.js";

/*READ*/
export const getEngineer = async(req,res)=>{
    try {
         const { id } =  req.params
         const engineer = await Engineer.findById(id)
         req.status(200).json(user);
    } catch (error) {
        res.status(404).json({ messagea:err.msessage })
    }
}