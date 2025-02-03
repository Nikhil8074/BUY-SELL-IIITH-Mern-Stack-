import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";

function Delivery() {

    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate()
     useEffect(() => {
            if(!user) {
                console.log("No user found");
                navigate('/',{ replace: true });
            }
        }, [user, navigate]);
    
    if(!user) {
        return null;
    }
    
    const [items, setItems] = useState([]);
    const [opts, setOpts] = useState({});
    const [errors, setErrors] = useState({});

    const fetchItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/order/delivery/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            console.log(data.message);
            setItems(data.items);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [user]);

    const handleOTPCheck = async (itemID) => {
        try {
            const requestBody = {
                user_id: user._id,
                item_id: itemID,
                otp: opts[itemID]
            }
            const response = await fetch(`http://localhost:5000/order/check_otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data.message);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [itemID]: null
                }));
                fetchItems();
            }
            else
            {
                console.log(data.message);
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [itemID]: data.message
                }));

                setTimeout(() => {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [itemID]: null
                    }));
                }, 3000);
            }
        }
        catch (err) {
            console.log(err);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [itemID]: "An error occurred while checking OTP"
            }));

            setTimeout(() => {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [itemID]: null
                }));
            }, 3000);
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
            <h1 style={{textAlign:"center"}}>Delivery Items</h1>
            <div className="cart-containerd">
                {items.length==0 ? (
                    <p>No items to deliver</p>
                ) : (
                    <div>
                        {items.map((item) => (
                            <div className="cart-itemd" key={item._id}>
                                <div className="item_detailsd">
                                    <h3>{item.name}</h3>
                                    <p>Price: {item.price}</p>
                                    <p>Category: {item.category}</p>
                                    <button onClick={() => navigate(`/item/${item._id}`)} className="add_item">Details</button>
                                    <form style={{display:"flex"}} onSubmit={(e) => {e.preventDefault(); handleOTPCheck(item._id)}}>
                                        <div style={{display:"flex",alignItems:"center"}}>
                                    <input type="text" placeholder="Enter OTP" value={opts[item._id]} onChange={(e) => setOpts({...opts, [item._id]: e.target.value})} required/>
                                    <button type="submit" className="add_item"  style={{marginLeft:"10px"}}>Done</button>
                                    </div>
                                    {errors[item._id] && <p style={{color:"#6b3030", textAlign:"center"}}>{errors[item._id]}</p>}
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    )
}

export default Delivery