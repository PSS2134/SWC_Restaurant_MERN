import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Listrow.css";
// import img from "./Images/Menu/Manchurian.jpg"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Listrow({id,title,url,quantity,price,total, setData, setTotalPrice}) {
  const Inputelement = useRef(null);
  
// console.log(data);
const {email, name} = JSON.parse(localStorage.getItem("user"));
  const ActionBtn = async (action) => {
      try {
        const res = await fetch(`http://localhost:8000/api/cart?email=${email}&action=${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            foodId : id, 
            quantity : 1,
            price : Number(price)

          }),
        });
        const resnew = await res.json();
        console.log("add", resnew);
        if (resnew.status == 200 && resnew.message == "Cart Updated successfully") {
          action == "add" ? toast.success(
            `1 more ${title} added to your cart`
          ) : toast.success(`1 ${title} removed from your cart`);
          setData(resnew.data.foods);
          setTotalPrice(resnew.data.totalPrice);
        } else {
          toast.error(resnew.message);
        }
      } catch (err) {
        toast.error(err);
        throw new Error(err);
      }
    
  };


  return (
    <div className="listrow-head-flexbox">
      <div className="listrow">
        <div className="listrow-col1">{id}</div>
        <div className="listrow-col2">
          <img className="listrow-img" src={url}></img>
          <p className="listrow-content">{title}</p>
        </div>
        <div className="listrow-col3">
          <button className="listrow-add-btn" onClick={() => ActionBtn("add")}>
            +
          </button>
          <input
            ref={Inputelement}
            className="listrow-input"
            value={quantity}
          />
          <button className="listrow-sub-btn" onClick={() => ActionBtn("remove")}>
          -
          </button>
        </div>
        <div className="listrow-col4">₹{price}</div>
        <div className="listrow-col5">₹{total}</div>
      </div>
    </div>
  );

}
export default Listrow;
