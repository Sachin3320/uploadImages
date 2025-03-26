import mongoose from "mongoose";

const imgSchema = new mongoose.Schema({  // ✅ Fixed `createSchema` → `new mongoose.Schema`
    img1: {
        secure_url: { type: String, required: true },  
        public_id:  { type: String, required: true },  
    },
    img2: {
        secure_url: { type: String, required: true },  
        public_id:  { type: String, required: true },
    },
    img3: {
        secure_url: { type: String, required: true }, 
        public_id:  { type: String, required: true },
    },
    img4: {
        secure_url: { type: String, required: true },
        public_id:  { type: String, required: true },
    },
    Active : {
        type : Boolean,
        default: false
    }
});

const Image = mongoose.model("Image", imgSchema);
export default Image;
