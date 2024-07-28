const {Router} = require("express")
const {updateUserDetails, deleteUser} = require("../controllers/userController")
const userRouter = Router()

userRouter.post("/update-user", updateUserDetails)
userRouter.post("/delete-user", deleteUser)

module.exports = userRouter;
