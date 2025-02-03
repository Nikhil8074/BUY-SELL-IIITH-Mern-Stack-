import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import "./sell.css";


function Sell() {

    const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();
    const [userItems, setUserItems] = useState([]);
    const [Search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState([]);

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
                const requestBody = {
                    search: Search,
                    categories: selectedCategory,
                };
                const response = await fetch(`http://localhost:5000/item/user-items/${user.email}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                const data = await response.json();
                if(response.ok) {
                    console.log(data);
                    setUserItems(data.items);
                } else {
                    console.log(data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        if(user) {
            fetchItems();
        }
    }, [user]);

    const handleCategoryChange = (category) => {
        setSelectedCategory((prevCategories) => {
            if (prevCategories.includes(category)) {
                return prevCategories.filter((c) => c !== category);
            } else {
                return [...prevCategories, category];
            }
        })
    };

    const [additem, setAdditem] = useState(false);
    const [itemdata, setItemdata] = useState({
        name: "",
        description: "",
        price: "",
        category: ""
    });
    const [additemMessage, setAdditemMessage] = useState('');

    const addItem = () => {
        setAdditemMessage('');
        setAdditem(true)
    }
    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/item/add-item/${user.email}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(itemdata)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setAdditemMessage(data.message);
                setAdditem(false);
            } else {
                setAdditemMessage(data.message);
                console.log(data);
            }
        } catch (err) {
            setAdditemMessage('An Error Occured While Adding Item');
            console.log(err);
        }
    }

    const handleRemoveItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/item/remove-item/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setUserItems(userItems.filter((item) => item._id !== id));
            } else {
                console.log(data);
            }
        } catch (err) {
            console.log(err);
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
                <h1 style={{textAlign: "center"}}>Present Sales</h1>
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

            <div className="sell">
                <div>
                    {userItems.length > 0 ? (
                        <div className="items_list">
                            {userItems.map((item) => (
                                <div key={item._id} className="item_card">
                                    <p>{item.name}</p>
                                    <p>Description: {item.description}</p>
                                    <p>Category: {item.category}</p>
                                    <p>Price: ₹{item.price}</p>
                                    <button className="add_item" onClick={() => handleRemoveItem(item._id)}>Remove Item</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No items listed for sale yet.</p>
                    )}
                </div>
                <div>
                <button className="add_item" onClick={addItem}>ADD ITEM</button>
                </div>
            </div>
            {additem && (
                <div className="update_form">
                <div className="update_content">
                    <h1>ITEM DETAILS</h1>
                    <form onSubmit={handleAddItem}>
                        {additemMessage && <p className="message">{additemMessage}</p>}
                        <div>
                        <label>Item Name:</label>
                        <input type="text" placeholder="Item Name" onChange={(e) => setItemdata({...itemdata, name: e.target.value})} required/>
                        </div>
                        <div>
                        <label>Item Description:</label>
                        <input type="text" placeholder="Item Description"  onChange={(e) => setItemdata({...itemdata, description: e.target.value})} required/>
                        </div>
                        <div>
                        <label>Item Category:</label>
                        <select onChange={(e) => setItemdata({...itemdata, category: e.target.value})}  defaultValue={""} required>
                            <option value="" disabled>Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food">Food</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Books">Books</option>
                            <option value="Sports / Games">Sports / Games</option>
                            <option value="Event Tickets">Event Tickets</option>
                            <option value="Other">Other</option>
                        </select>
                        </div>
                        <div>
                        <label>Item Price:</label>
                        <input type="text" placeholder="Item Price"  onChange={(e) => setItemdata({...itemdata, price: e.target.value})} required/>  
                        </div>
                        <button type="submit">ADD ITEM</button>
                        <b>  </b>
                        <button type="button" onClick={() => setAdditem(false)}>CANCEL</button>
                    </form>
                </div>
                </div>
            )}
        </div>
    )
}

export default Sell;