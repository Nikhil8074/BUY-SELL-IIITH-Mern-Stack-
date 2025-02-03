import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import "./buy.css";

function Buy() {

    const [items, setItems] = useState([]);
    const [Search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState([]);
    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const [cartStatus, setCartStatus] = useState({});
    const navigate = useNavigate();

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
        fetchItems();
    }, [Search, selectedCategory]);

    const fetchItems = async () => {
        try {
            const requestBody = {
                search: Search,
                categories: selectedCategory,
            };
            const response = await fetch(`http://localhost:5000/item/buy-items/${user.email}/`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setItems(data.items);
                const cartStatusMap = {};
                for(const item of data.items) {
                    const cartresponse = await fetch(`http://localhost:5000/order/in_cart/${user._id}/${item._id}`);
                    const cartdata = await cartresponse.json();
                    if(cartdata.message === "false") {
                        cartStatusMap[item._id] = false;
                    }
                    else {
                        cartStatusMap[item._id] = true;
                    }

                }
                setCartStatus(cartStatusMap);
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((c) => c !== category);
            } else {
                return [...prevCategories, category];
            }
        })
    };

    const handleDetails = (id) => {
        navigate(`/item/${id}`);
    };

    const handleAddToCart = async (id) => {
        try {
            const requestBody = {
                user_id: user._id,
                item_id: id,
            };
        const response = await fetch(`http://localhost:5000/order/cart/add_to_cart`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setCartStatus((prevStatus) => ({
                    ...prevStatus,
                    [id]: true
                }))
            } else {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const removeFromCart = async (id) => {
        try {
            const requestBody = {
                user_id: user._id,
                item_id: id,
            };
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
                setCartStatus((prevStatus) => ({
                    ...prevStatus,
                    [id]: false
                }))
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
                        <Link to="/delivery" className="a" id="delivery">   
                        <TbTruckDelivery className="cart_icon"/>
                        </Link>
                        <Link to="/history" className="a" id="history">   
                        <FaHistory className="cart_icon"/>
                        </Link>
            </div>
                        <Link to="/profile" className="a">
                        <CgProfile className="profile_icon"/>
                        </Link>
                        <div>
                            <h1 style={{textAlign:"center"}}>Items for SALE</h1>
                        </div>

            <div className="search_bar">
                <input type="text" placeholder="Search for items" value={Search} onChange={(e) => setSearch(e.target.value)} />
            </div>   
            <div className="filter_section">
                <h3>Filter by Categories</h3>
                <div className="categories">
                    {[
                        "Electronics",
                        "Clothing",
                        "Books",
                        "Furniture",
                        "Sports / Games",
                        "Event Tickets",
                        "Health",
                        "Food"].map((category) => (
                            <label key={category}>
                                <input type="checkbox" value={category} checked={selectedCategory.includes(category)}  onChange={() => handleCategoryChange(category)}/>
                                {category}
                            </label>
                        ))}
                </div>
            </div> 

            <div>
                    {items.length > 0 ? (
                        <div className="items_list">
                            {items.map((item) => (
                                <div key={item._id} className="item_card">
                                    <p>{item.name}</p>
                                    <p>Category: {item.category}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <button className="add_item" onClick={()=>handleDetails(item._id)}>Details</button>
                                    <b>   </b>
                                    {cartStatus[item._id] ? (
                                        <button className="add_item" onClick={()=>removeFromCart(item._id)}>Remove from Cart</button>
                                    ):(
                                        <button className="add_item" onClick={()=>handleAddToCart(item._id)}>Add to Cart</button>
                                    )}   
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: "center" }}>No items listed for sale yet.</p>
                    )}
                </div>
            

        </div>
    );
}

export default Buy;