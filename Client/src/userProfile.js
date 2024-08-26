import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./userProfile.css";
import { useNavigate } from "react-router-dom";

import cart_icon from "./Images/Menu/icons8-cart-48.png";
import Footer from "./Footer";
import Spinner from "./Spinner";
import db from "./data";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Images
import edit from "./Images/edit.png";
import user from "./Images/userImg.png";

//Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./Navbar";

function Profile({ updateUser }) {
  const navigate = useNavigate();

  const [order, setOrder] = useState({});
  const userData = JSON.parse(localStorage.getItem("user"));
  const [nameuser, setNameUser] = useState(userData?.name);
  const emailuser = userData?.email;
  const [contactuser, setContactUser] = useState(userData?.phone || "NA");
  // const Logout = () => {
  //   localStorage.removeItem("user");
  //   const user = localStorage.getItem("user");
  //   toast.success("Thanks for Visiting Menu");
  //   updateUser(user);
  // };
  const email = userData.email;

  useEffect(() => {
    fetch(`http://localhost:8000/api/profile?email=${email}`)
      .then((res) => res.json())
      .then((res1) => {
        console.log(res1);
        setLoading(false);
        setOrder(res1.data);
      });
  }, []);
  // console.log(order);

  const [data, setData] = useState({});
  const [picture, setPicture] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, seteditMode] = useState(false);
  
  const postDetails = async (picture) => {
    // console.log(picture);
    console.log(picture);
    setLoading(true);
    if (picture == undefined) {
      toast.warning("Please Upload a image");
      return;
    } else if (picture.size >= 1048576) {
      toast.warning("The size of image is greater than 1mb");
      setLoading(false);
      return;
    }
    const data = new FormData();
    data.append("file", picture);
    data.append("upload_preset", "tc3augsj");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dcbrlaot1/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      // console.log(urlData.url);
      setPicture(urlData.url.toString());
      setLoading(false);
      setImagePreview(URL.createObjectURL(picture));
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleImage = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8000/api/image?email=${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({url : picture}),
    });
    const resNew = await res.json();
    if (resNew.status == 200 && resNew.message == "Image Updated Successfully") {
      setLoading(false);
      toast.success("Image uploaded successfully");
      userData.url = picture;
      localStorage.setItem("user", JSON.stringify(userData));
      setImagePreview(null);
      setPicture(null);
    } else {
      setLoading(false);
      toast.error("Try again!");
    }
  };
  const showPopup = () => {
    toast.warn("Tap on Image to change !");
  };

  const handleEdit = () => {
    seteditMode(!editMode);
  };

  const handleNameChange = (e) => {
    setNameUser(e.target.value);
  };
  //  const handleEmailChange =  (e) => {
  // setContactUser(e.target.value);

  //  }
  const handleContactChange = (e) => {
    setContactUser(e.target.value);
  };
  const handleProfileSave = async () => {
    const res = await fetch(
      `http://localhost:8000/api/profile?email=${email}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameuser, contact: contactuser }),
      }
    );
    const data = await res.json();
    if (data == "updated") {
      seteditMode(false);
      toast.success("Updated");
      window.location.reload();
    }
  };

  return (
    <>
      {/*Navbar Here */}
      {loading ? (
        <Spinner title={"Setting up Your Profile :)"} />
      ) : (
        <>
          {" "}
          <Navbar inside={true} updateUser={updateUser}/>
          <p
            className="userProfile-header"
            style={{ backgroundColor: "#f5f5f5" }}
          >
            Hey! See your all orders here..
          </p>
          <div
            className="profile-outer-box"
            style={{
              display: "flex",
              justifyContent: "center",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div className="userprofile-box" style={{ padding: "0 3%" }}>
              <label htmlFor="image-upload" className="image-upload-label">
                <img
                  onMouseOver={showPopup}
                  src={imagePreview || (!userData?.url ? user : userData.url)}
                  className="userProfile-userimg"
                />
                {/* <FontAwesomeIcon icon="fa-solid fa-circle-plus" style={{color: "#22a607",}} /> */}
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png, image/jpeg"
                onChange={(e) => postDetails(e.target.files[0])}
              />
              {picture && (
                <button
                  style={{
                    padding: "4%",
                    marginTop: "5%",
                    width: "50%",
                    borderRadius: "10px",
                    backgroundColor: "blueviolet",
                    color: "white",
                    border: "none",
                    boxShadow: "2px 2px 2px black",
                  }}
                  onClick={(e) => handleImage(e)}
                >
                  Save
                </button>
              )}
            </div>
            <div className="userProfile-profile">
              <img className="user-edit" onClick={handleEdit} src={edit} />
              <div className="userProfile-profile-content">
                <p className="userProfile-label">Name</p>
                {editMode ? (
                  <input
                    className="userProfile-input"
                    type="text"
                    onChange={handleNameChange}
                    name="nameuser"
                    value={nameuser}
                  />
                ) : (
                  <p className="userProfile-input">{nameuser}</p>
                )}
              </div>
              <div className="userProfile-profile-content">
                <p className="userProfile-label">Email</p>
                <p className="userProfile-input">{emailuser}</p>
              </div>
              <div className="userProfile-profile-content">
                <p className="userProfile-label">Contact</p>
                {editMode ? (
                  <input
                    className="userProfile-input"
                    type="text"
                    value={contactuser}
                    onChange={handleContactChange}
                    name="contactuser"
                  />
                ) : (
                  <p className="userProfile-input">{contactuser}</p>
                )}
              </div>
              {editMode && (
                <button
                  onClick={handleProfileSave}
                  className="profile-edit-button"
                >
                  Save
                </button>
              )}
            </div>
          </div>
          <div>
            <div
              className="profile-order-box"
              style={{ backgroundColor: "#f5f5f5", padding: "2% 0" }}
            >
              <div
                style={{
                  height: "90vh",
                  overflowY: "scroll",
                  backgroundColor: "#f5f5f5",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Order Items</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Amount</th>
                      <th>Address</th>
                      {/* <th>Action</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {order &&
                      order.toReversed().map((SingleOrder) => {
                        return (
                          <tr>
                            <td>{SingleOrder.orderid}</td>
                            {/* <td>{singleOrder.food}</td> */}
                            <td>
                              {SingleOrder.foods?.length > 0 &&
                                SingleOrder.foods.map((singleFood) => {
                                  return (
                                    <b>
                                      <span style={{ padding: "20px 10px" }}>
                                        {singleFood.quantity} x{" "}
                                        {db[singleFood?.foodId - 1]?.title},
                                      </span>
                                    </b>
                                  );
                                })}
                            </td>
                            <td>{SingleOrder.date}</td>
                            <td>{SingleOrder.time}</td>
                            <td>Rs {SingleOrder.totalPrice}</td>
                            <td>
                              <div style={{ width: "25vw", border: "none" }}>
                                <p style={{ padding: "10px 10px" }}>
                                  {SingleOrder?.address?.contact}
                                </p>
                                <p style={{ padding: "10px 10px" }}>
                                  {SingleOrder?.address?.flatno}
                                </p>
                                <p style={{ padding: "10px 10px" }}>
                                  {SingleOrder?.address?.address}
                                </p>
                                <p style={{ padding: "10px 10px" }}>
                                  {SingleOrder?.address?.landmark}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}
export default Profile;
