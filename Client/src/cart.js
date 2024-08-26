import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import "./Cart.css";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Listrow from "./Listrow";
import Address from "./Address";
//Images
import user from "./Images/user.png";
import cart from "./Images/Cart/Cart.svg";
import cart_icon from "./Images/Menu/icons8-cart-48.png";
import db from "./data";

//spinner
import Spinner from "./Spinner";
import Navbar from "./Navbar";

const datanew = [];
function Cart({ updateUser }) {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const [data, setData] = useState([]);
  const Logout = () => {
    localStorage.removeItem("user");
    const user = localStorage.getItem("user");
    toast.success("Thanks for Visiting Menu");
    updateUser(user);
  };
  const { email, name } = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetch(`http://localhost:8000/api/cart?email=${email}`)
      .then((res) => {
        return res.json();
      })
      .then((resNew) => {
        console.log(resNew);
        setIsLoading(false);
        setData(resNew?.data?.foods);
        setTotalPrice(resNew?.data?.totalPrice);
      })
      .catch((err) => console.log(err));
  }, []);

  // {data && data.map((singleFood)=>{
  //    setWholeTotal(wholeTotal+singleFood.price*singleFood.quantity);
  // })}
  console.log(totalPrice);
  console.log(data);
  if (!data || data.length == 0) {
    console.log(isLoading);

    return (
      <>
        {isLoading ? (
          <Spinner title="Preparing Your Cart..." />
        ) : (
          <>
            <Navbar inside={true} updateUser={updateUser} />
            <div
              style={{ backgroundColor: "#f5f6f9", height: "100vh" }}
              className="header-flexbox"
            >
              {
                <p className="cart-header">
                  Hey!{" "}
                  <span style={{ color: "blueviolet", fontWeight: "600" }}>
                    {name}
                  </span>
                  ,<br></br>Welcome to the Cart!,<br></br>
                  <span style={{ color: "red", fontWeight: "600" }}>
                    No Items yet
                  </span>{" "}
                </p>
              }

              <img
                style={{ backgroundColor: "#f5f6f9" }}
                className="cart-img"
                src={cart}
              />
            </div>
          </>
        )}
      </>
    );
  } else {
    return (
      <>
        {isLoading ? (
          <Spinner title="Preparing Your Cart..." />
        ) : (
          <>
            <Navbar inside={true} updateUser={updateUser} />
            <div className="header-flexbox">
              {name && (
                <p className="cart-header">
                  Hey!{" "}
                  <span style={{ color: "blueviolet", fontWeight: "600" }}>
                    {name}
                  </span>
                  ,<br></br> Welcome to the Cart!
                </p>
              )}

              <img className="cart-img" src={cart} />
            </div>
            <div className="list-header">
              <ul className="list-head-elements">
                <li className="list1">Id</li>
                <li className="list2">Order</li>
                <li className="list3">Quantity</li>
                <li className="list4">Price</li>
                <li className="list5">Total</li>
              </ul>
            </div>
            <div>
              {data &&
                data.map((single) => {
                  if (single.foodId > 0) {
                    const a = Number(single.price);
                    const total = a * single.quantity;
                    const dish = db[single?.foodId - 1];
                    console.log(dish);
                    return (
                      <Listrow
                        id={dish.id}
                        url={dish.url}
                        title={dish.title}
                        quantity={single.quantity}
                        price={dish.price}
                        total={total}
                        desc={dish.description}
                        setTotalPrice={setTotalPrice}
                        setData={setData}
                      />
                    );
                  }
                })}
              {}
              <div className="cart-totalprice-box-parent">
                <div className="cart-totalprice-box">
                  <p className="cart-totalprice">
                    Total Amount : ₹ {totalPrice}
                  </p>
                </div>
              </div>
            </div>
            <p className="cart-address-header">
              Fill the Address & Proceed to checkout
            </p>
            <Address data={data} />
            <Footer />
          </>
        )}
      </>
    );
  }
}

export const food = datanew;
export default Cart;
