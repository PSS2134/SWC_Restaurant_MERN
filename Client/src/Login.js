import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn({ updateUser }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ email: "", password: "" });
  let name, value;
  const loginData = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUserData({ ...userData, [name]: value });
  };
  const Login = async (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      toast.warning("Please Fill the Data");
    } else {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const res1 = await res.json();
      console.log(res1)
      if (res1.status == 400 &&  res1.message == "User not found") {
        toast.error("Please SignUp first");
        navigate("/signup");
      } else if (res1.status == 400 && res1.message == "Invalid Password") {
        toast.error("Please Enter Correct Password");
        navigate("/login");
      } else if (res1.status == 200 && res1.message == "Login Successful") {
        console.log(res1.data)
        updateUser(res1.data);
        toast.success("LoggedIn Successfully");
        navigate("/menu");
      }
    }
  };
  return (
    <div>
      <div className="body">
        <div className="card">
          <h1>Login</h1>
          <form>
            <p className="formlabel">Email</p>
            <input
              type="text"
              className="forminput"
              name="email"
              onChange={loginData}
            />
            <p className="formlabel">Password</p>
            <input
              type="password"
              className="forminput"
              name="password"
              onChange={loginData}
            />
            <button className="formbtn" onClick={Login}>
              Submit
            </button>
            <p className="formfoot">
              Don't Have an Account? <a href="/signup">Please Signup</a>
            </p>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default SignIn;
