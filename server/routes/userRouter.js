const {Router} = require("express")
const {getUserDetails, updateUserDetails, deleteUser} = require("../controllers/userController")
const userRouter = Router()

userRouter.get("/get-user", getUserDetails)
userRouter.post("/update-user", updateUserDetails)
userRouter.post("/delete-user", deleteUser)

module.exports = userRouter;