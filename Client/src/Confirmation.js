import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { useNavigate } from "react-router-dom";
import "./Confirmation.css";
import Footer from "./Footer";
import { food } from "./cart";
import Spinner from "./Spinner";
import db from "./data";
import { v4 as uuid } from "uuid";

//Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Images
import cart_icon from "./Images/Menu/icons8-cart-48.png";
import confirmOrder from "./Images/Confirmation/deliverytruck.svg";
import user from "./Images/user.png";
import Navbar from "./Navbar";

const Confirmation = ({ updateUser }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [address, setAddress] = useState({});
  const order_id = uuid().slice(0, 8);
  // console.log(food);
  const Logout = () => {
    localStorage.removeItem("user");
    const user = localStorage.getItem("user");
    toast.success("Thanks for Visiting Menu");
    updateUser(user);
  };
  const { email, name } = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    fetch(`http://localhost:8000/api/address?email=${email}`)
      .then((response) => response.json())
      .then((resNew) => {
        //console.log(resNew);
        setIsLoading(false);
        setOrder(resNew?.data?.food);
        setTotalPrice(resNew?.data?.totalPrice);
        setAddress(resNew?.data?.address);
      });
  }, []);

  // console.log(order.food);

  const placeOrder = async () => {
    localStorage.setItem("order_id", JSON.stringify(order_id));
    console.log(order_id);
    const res = await fetch(
      `http://localhost:8000/api/order?email=${email}&orderId=${order_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resnew = await res.json();
    if (resnew.status == 200 && resnew.message == "Order Inserted successfully") {
      toast.success("Order Placed Successfully");
      navigate("/menu/cart/confirm/orderplaced");
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      {isLoading ? (
        <Spinner title="Confirm Your Order!" />
      ) : (
        <>
          {" "}
          <Navbar inside={true} updateUser={updateUser}/>
          <div className="confirmation-page">
            {/* <p className='confirmation-name'>Hey {name}!</p> */}
            {order && (
              <>
                <p className="confirmation-header">
                  Hey! {name},<br></br>Here are your final order items!
                  <span className="confirmation-span">Please have a look</span>
                </p>
                <div className="confirmation-img-parent">
                  <img className="confirmation-img" src={confirmOrder} />
                </div>

                <div style={{ backgroundColor: "#f5f6f9" }}>
                  <div className="confirmation-flexbox">
                    <div className="confirmation-orderitem-box">
                      <p className="confirmation-order-header">Order Items</p>
                      <p className="confirmation-order-content">
                        {order &&
                          order.map((singleFood) => {
                            return (
                              <>
                                <span className="confirmation-food-items">
                                  <b>{singleFood?.quantity}</b> x{" "}
                                  {db[singleFood?.foodId - 1].title},
                                </span>
                              </>
                            );
                          })}
                      </p>
                      <p className="confirmation-order-content">
                        Total price: <b>Rs {totalPrice}</b>
                      </p>
                    </div>

                    <div className="confirmation-address-box">
                      <p className="confirmation-address-header">
                        Billing Address
                      </p>
                      <p className="confirmation-address-content">{name},</p>
                      <p className="confirmation-address-content">
                        {address.contact}
                      </p>
                      <p className="confirmation-address-content">
                        {address.flatno}
                      </p>
                      <p className="confirmation-address-content">
                        {address.address}
                      </p>
                      <p className="confirmation-address-content">
                        {address.landmark}
                      </p>
                    </div>
                  </div>
                  <div style={{ backgroundColor: "#f5f6f9", padding: "5% 0" }}>
                    <button
                      onClick={placeOrder}
                      className="confirmation-btn"
                      type="submit"
                    >
                      Confirm Order
                    </button>
                  </div>
                </div>
              </>
            )}
            <Footer />
          </div>
        </>
      )}
    </>
  );
};
export default Confirmation;
