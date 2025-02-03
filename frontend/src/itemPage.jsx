import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import { TbTruckDelivery } from "react-icons/tb";

function ItemPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    const [isAddedToCart, setIsAddedToCart] = useState(false);

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
        fetchItem();
    }, []);

    const fetchItem = async () => {
        try {
            const response = await fetch(`http://localhost:5000/item/${id}`);
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                setItem(data.item);
                const cartresponse = await fetch(`http://localhost:5000/order/in_cart/${user._id}/${id}`);
                const cartdata = await cartresponse.json();
                console.log(cartdata.message);
                if(cartdata.message === "true") {
                    setIsAddedToCart(true);
                }
                else {
                    setIsAddedToCart(false);
                }
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (!item) {
        return <p>Loading item details...</p>;
    }

    const handleAddToCart = async () => {
        try {
            const requestBody = {
                user_id: user._id,
                item_id: id,
            };
            const response = await fetch(`http://localhost:5000/order/cart/add_to_cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setIsAddedToCart(true);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const removeFromCart = async () => {
        try {
            const requestBody = {
                user_id: user._id,
                item_id: id,
            };
            const response = await fetch(`http://localhost:5000/order/cart/remove_from_cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                setIsAddedToCart(false);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
        <div className="item-page">
            <button className="add_item" onClick={() => navigate(-1)} >Go Back</button>
            <div className="item_details_card">
            <h1>{item.name}</h1>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Category:</strong> {item.category}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Seller:</strong> {item.seller_id.firstName} {item.seller_id.lastName}</p>
            <p><strong>Contact:</strong> {item.seller_id.contactNumber}</p>
            <p><strong>Email:</strong> {item.seller_id.email}</p>
            {isAddedToCart ? (
                <button className="add_item" onClick={()=>removeFromCart()}>Remove from Cart</button>
                    ):(
                    <button className="add_item" onClick={()=>handleAddToCart()}>Add to Cart</button>
                )}
            </div>
        </div>
        </div>
    );
}

export default ItemPage;
