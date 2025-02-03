import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import "./history.css";

function History() {
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();
    const [history, setHistory] = useState({
        pendingOrders: [],
        boughtItems: [],
        cancelledOrders: [],
        soldItems: []
    });

    const [otpMap, setOtpMap] = useState({});

    useEffect(() => {
        if(!user) {
            console.log("No user found");
            navigate('/',{ replace: true });
        }
    }, [user, navigate]);

    if(!user) {
        return null;
    }
    const fetchHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/history/${user.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            setHistory(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchHistory();
    },[user]);

    const generateOTP = async (orderID) => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
        const requestBody = {
            order_id: orderID,
            otp: otp
        }
        try {
            const response = await fetch('http://localhost:5000/order/generate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                setOtpMap((prevMap) => ({
                    ...prevMap,
                    [orderID]: otp
                }));
            }
            else {
                console.log(data);
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <div >
            
           <div className="title">
                <Link className="a" id="b">   
                <h1>BuySell @ IIITH</h1>
                </Link>
                <Link to="/buy" className="a">   
                <h1>BUY</h1>
                </Link>
                <Link to="/sell" className="a">   
                <h1>SELL</h1>
                </Link>
                <Link to="/cart" className="a">   
                <FaShoppingCart className="cart_icon"/>
                </Link>
                <Link to="/delivery" className="a">   
                <TbTruckDelivery className="cart_icon"/>
                </Link>
                <Link to="/history" className="a" id="history">   
                <FaHistory className="cart_icon"/>
                </Link>
            </div>
            <Link to="/profile" className="a">
            <CgProfile className="profile_icon"/>
            </Link>
            
            <div className="order-history">
                <div className="category">
                    <h1>Pending Orders</h1>
                    <div className="items-container">
                    {history.pendingOrders.length === 0 ? (
                        <p>No pending orders</p>
                    ): (
                        history.pendingOrders.map((order) => (
                            <div className="order-item" key={order._id}>
                                <p>Item: {order.item_id.name}</p>
                                <p>Category : {order.item_id.category}</p>
                                <p>Price: {order.Amount}</p>
                                <p>Seller: {order.seller_id.firstName} {order.seller_id.lastName}</p>
                                {otpMap[order._id] ? (
                                    <p>OTP: {otpMap[order._id]}</p>
                                ): (
                                    <button onClick={() => generateOTP(order._id)} className="add_item" style={{marginTop: '2px'}}>Generate OTP</button>
                                )}
                            </div>
                        ))
                    )}
                    </div>
                </div>
                <div className="category">
                    <h1>Items Bought</h1>
                    <div className="items-container">
                    {history.boughtItems.length === 0 ? (
                        <p>No Items have been bought</p>
                    ): (
                        history.boughtItems.map((order) => (
                            <div className="order-item" key={order._id}>
                                <p>Item: {order.item_id.name}</p>
                                <p>Category : {order.item_id.category}</p>
                                <p>Price: {order.Amount}</p>
                                <p>Seller: {order.seller_id.firstName} {order.seller_id.lastName}</p>
                            </div>
                        ))
                    )}
                    </div>
                </div>
                <div className="category">
                    <h1>Items Sold</h1>
                    <div className="items-container">
                    {history.soldItems.length === 0 ? (
                        <p>No Items sold</p>
                    ): (
                        history.soldItems.map((order) => (
                            <div className="order-item" key={order._id}>
                                <p>Item: {order.item_id.name}</p>
                                <p>Category : {order.item_id.category}</p>
                                <p>Price: {order.Amount}</p>
                            </div>
                        ))
                    )}
                    </div>
                </div>
                <div className="category">
                    <h1>Cancelled Orders</h1>
                    <div className="items-container">
                    {history.cancelledOrders.length === 0 ? (
                        <p>No cancelled orders</p>
                    ): (
                        history.cancelledOrders.map((order) => (
                            <div className="order-item" key={order._id}>
                                <p>Item: {order.item_id.name}</p>
                                <p>Category : {order.item_id.category}</p>
                                <p>Price: {order.Amount}</p>
                                <p>Seller: {order.seller_id.firstName} {order.seller_id.lastName}</p>
                            </div>
                        ))
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default History;