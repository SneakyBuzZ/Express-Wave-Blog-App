import { Router } from "express"
import { changePassword, getAllUserCount, getCurrentUser, getUserDetailsById, loginUser, logoutUser, registerUser, renewAccessToken, updateAccountDetails, updateAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js"

const userRouter = Router();

//===================== AUTH ROUTES ==================
userRouter.route("/register").post(registerUser)

userRouter.route("/login").post(loginUser)


//=============== SECURED ROUTES ===================
userRouter.route("/logout").post(verifyJwt, logoutUser)

userRouter.route("/refresh-token").post(renewAccessToken)

userRouter.route("/change-password").post(verifyJwt, changePassword)

userRouter.route("/current-user").get(verifyJwt, getCurrentUser)

userRouter.route("/update-account").patch(verifyJwt, updateAccountDetails)

userRouter.route("/update-avatar").patch(
    verifyJwt,
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
    ]),
    updateAvatar
)

userRouter.route("/get-userById").get(getUserDetailsById)


userRouter.route("/get-allUserCount").get(getAllUserCount)
    ;

export default userRouter