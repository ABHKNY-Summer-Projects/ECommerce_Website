import { useState } from "react"
import axios from 'axios'
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function EditProfile() {

    const [userInfo, setUserInfo]  = useState({
        first_name: "",
        last_name: "",
        email: "",
        old_password: "",
        new_password: "" 
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:8080/api/users/update-user', userInfo)
        .then((response) => {
            toast.success("User Data Updated Successfully!", {autoClose: 4000})
            console.log(response)
        })
        .catch((error) => {
            toast.error("Invalid Credentials", {autoClose: 4000})
            console.error(error)
        })

        setUserInfo({
            first_name: "",
            last_name: "",
            email: "",
            old_password: "",
            new_password: "" 
        })

    }
    const handleChange = (e) => {
        setUserInfo({...userInfo, [e.target.name]: e.target.value})
    }
    return (
        <div className = "flex h-screen justify-center items-center md: m-10">
            <div className = "m-auto shadow-lg w-full md:w-3/4">
                <div className = "px-20 pt-10 pb-10">
                    <div className = "text-regalred font-medium mb-6">Edit Your Profile</div>
                    <form onSubmit={handleSubmit}>
                        <div className = "flex flex-wrap justify-between w-full mb-5 text-sm">
                            <div className="w-full md:w-1/2 md:pr-2">
                                <p className = "text-sm mb-2">First Name</p>
                                <input type = "text" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder="Md" id = "first_name" 
                                name = "first_name" value = {userInfo.first_name} onChange={handleChange} required></input>
                            </div>
                            <div className="w-full md:w-1/2 md:pr-2">
                                <p className = "text-sm mb-2">Last Name</p>
                                <input type = "text" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder="Rimel" id = "last_name" 
                                name = "last_name" value = {userInfo.last_name} onChange={handleChange} required></input>
                            </div>
                        </div>
                        <div className = "flex flex-wrap w-full mb-5 text-sm">
                            <div className="w-full md:w-1/2 md:pr-2">
                                <p className = "text-sm mb-2">E-mail</p>
                                <input type = "text" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder = "kidusm3l@gmail.com" id = "email" 
                                name = "email" value = {userInfo.email} onChange={handleChange} required></input>
                            </div>
                            <div className="w-full md:w-1/2 md:pr-2">
                                <p className = "text-sm mb-2">Address</p>
                                <input type = "text" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder = "St. GEORGE IV STREET" id = "address" 
                                name = "address" value = {userInfo.address} onChange={handleChange} required></input>
                            </div>
                        </div>
                        <div className = "flex-col flex-wrap justify-between w-full mb-5 text-sm">
                            <p className = "text-sm mb-2">Password Changes</p>
                            <div className = "mb-3 w-full">
                                <input type = "password" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder="Current Password" id  = "old_password" 
                                name  = "old_password" value = {userInfo.old_password} onChange={handleChange} required></input>
                            </div>
                            <div className = "mb-3 w-full">
                                <input type = "password" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder="New Password" id = "new_password" 
                                name = "new_password" value = {userInfo.new_password} onChange={handleChange} required></input>
                            </div>
                            <div className = "mb-3 w-full">
                                <input type = "password" className = "bg-gray-100 outline-none rounded-md p-3 w-full" placeholder="Confirm Password" id = "" name = "" ></input>
                            </div>
                        </div>
                        <div className = "flex justify-end">
                            <button className = "mr-2 text-sm">
                                Cancel
                            </button>
                            <button type = "submit" className="bg-regalred py-3 px-5 rounded-md text-white text-sm ml-2">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}