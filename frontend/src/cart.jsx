import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

function Cart() {

    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
            if(!user) {
                console.log("No user found");
                navigate('/',{ replace: true });
            }
        }, [user, navigate]);
    
    if(!user) {
        return null;
    }
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`http://localhost:5000/order/cart/${user.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                setCartItems(data.itemsinCart);
                setTotalPrice(data.totalAmount);
            } catch (err) {
                console.log(err);
            }
        };
        fetchItems();
    },[user]);
    const handleRemoveFromCart = async (id) => {
        const requestBody = {
            user_id: user._id,
            item_id: id,
        };
        try {
            const response = await fetch(`http://localhost:5000/order/cart/remove_from_cart`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setCartItems(cartItems.filter(item => item._id !== item_id));
                setTotalPrice(totalPrice - data.order.Amount);
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
    }
    };

    const handleBuyNow = async () => {
        const requestBody = {
            user_id: user._id,
        };
        try {
            const response = await fetch(`http://localhost:5000/order/cart/buy_now`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setCartItems([]);
                setTotalPrice(0);
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
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
            <h2 style={{textAlign:"center"}}>Cart</h2>
            <div className="cart-container">
                {cartItems.length === 0 ? (
                    <p>No items in cart</p>  
                ):(
                    <div>
                        {cartItems.map((item) => (
                            <div className="cart-item" key={item._id}>
                                <div className="item_details">
                                <h3>{item.name}</h3>
                                <p>Price: {item.price}</p>
                                <p>Category : {item.category}</p>
                                <p>Seller : {item.seller_id.firstName} {item.seller_id.lastName}</p>
                                <button onClick={() => navigate(`/item/${item._id}`)} className="add_item">Details</button>
                                <button onClick={() => handleRemoveFromCart(item._id)} className="add_item">Remove</button>
                                </div>
                            </div>
                        ))}
                        <h3>Total Price: {totalPrice}</h3>
                        <button className="add_item" onClick={handleBuyNow}>Buy</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart;