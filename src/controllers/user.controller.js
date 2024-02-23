
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) =>{
    // Step 
    // get user details from front-end
    // validation-- not empty
    // check if user already exists: username, email
    // check for images, check for avatar that is compussary
    // upload them to cloudinary, avatar
    // create user object - create entry in db 
    // remove password and refresh token field from response
    // check for user creation
    // return res
try{
    const {fullName, email, username, password } =req.body   // req.body express ne dia h  
    // console.log("email: ", email);
    
    // if (fullName === ""){
    //     throw new ApiError(400, "fullname is required")
    // }

// check all together  // Validate input fields
    if (
        [fullName, email, username, password].some((field) => !field || field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
 } 
    
    const existedUser = await User.findOne({
        $or: [{ username }, {email}]
    })
    
    if(existedUser){
        throw new ApiError (409, "User with email or username already exists")
    }

    // console.log(req.files)
    // console.log(req.body)
    // req.body me sare data aata but also hm lof route k andr ek middle ware addkiye h toh middleware also give some access its add some access in req field like req.files 
    
    const avatarLocalPath = req.files?.avatar[0]?.path; 
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }
    
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    

    
    // ? use for optionaly check for access available or not
    // avataar ka pass size, type yeh sb hoga ..[0] used for need 1st index of file 
   
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering a user" )
    }
    
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );
}catch(error){
    console.error(error);
    res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));

}
    // res.status(200).json({
    //     message: "okay"
    // })
})

const loginUser = asyncHandler(async (req,res)=>{
    //
    // req body -> data lao
    // username or email login
    // find the user
    // validate the password check
    // access and refresh token generate
    // send in cookie
    // response successfully login 

    const {email, username, password} = req.body 

    if(!usernmae || !email){
        throw new ApiError(400, "username or password is requires")
    }

    
})




export {
    registerUser,
}