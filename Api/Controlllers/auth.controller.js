import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";


export const signup =  async (req, res, next) => {
  const { username, email, password } = req.body;
   const hashedPassword = bcrypt.hashSync(password,10);
  const newUser = new User({ username, email, password: hashedPassword });
   try{
      await newUser.save()
      res.status(201).json({
      success: true, 
      message: "User created successfully",
    });
   } catch (error) {
      next(error);
   }
};


export const signin = async (req, res, next) => {
   const {email,password } = req.body;
   try{
       const validUser = await User.findOne({email});
       if(!validUser) return next (errorHandler(404, "User not found"));
       const validPassword  = bcrypt.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(401, "Wrong credentials"));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET)
        const {password:pass,...rest } = validUser._doc;

        res.cookie("access_token", token, {
          httpOnly: true,
          sameSite : "none",
          secure : true,
        }).status(200).
        json({ success: true,
              ...rest,
              token });
   }catch(error){
      next(error);

   }
};

export const google = async (req,res,next)=>{
   try {
      const user = await User.findOne({ email: req.body.email });
      if(user){

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
         const {password:pass,...rest } = user._doc;

         return res.cookie("access_token", token, {
            httpOnly: true,
            sameSite : "none",
            secure : true, 
          }).status(200).json({success: true,
                               ...rest,
                                token });
      }
      else{
          const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
            const newUser = new User ({
               username:req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
               email: req.body.email,
               password: hashedPassword,
               avatar:req.body.avatar,
               
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const {password:pass,...rest } = newUser._doc;
            res.cookie("access_token", token, {
               httpOnly: true, 
             }).status(200).json({success: true,...rest, token});

      }
   } catch (error) {
      next(error);
   };
}; 
 
export const signOut = (req, res) => {
   try {
      res.clearCookie("access_token");
      res.status(200).json({
         success: true,
         message: "User signed out successfully",
      });
   } catch (error) {
      next(error);
   }
}
  
