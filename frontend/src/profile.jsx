import React , {useEffect, useState} from "react";
import { useLocation, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import { CgProfile } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import { set } from "mongoose";
import { TbTruckDelivery } from "react-icons/tb";

function Profile() {
    const location = useLocation();
    const user = location.state?.user || JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'));                            
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [editModeMessage, setEditModeMessage] = useState("");
    const [changePasswordMessage, setChangePasswordMessage] = useState("");
    const [successedit, setSuccessedit] = useState("");
    const [successChangePassword, setSuccessChangePassword] = useState("");
    
    useEffect(() => {
        if(!user) {
            console.log("No user found");
            navigate('/',{ replace: true });
        }
    }, [user, navigate]);

    if(!user) {
        return null;
    }

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        dateOfBirth: user.dateOfBirth,
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
    });

    const handlelogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');

        navigate('/',{ replace: true });
    };

    useEffect(() => {
        if(successedit) {
            const timer = setTimeout(() => {
                setSuccessedit('');
            },2000);
            return () => clearTimeout(timer);
        }
    }, [successedit]);

    useEffect(() => {
        if(successChangePassword) {
            const timer = setTimeout(() => {
                setSuccessChangePassword('');
            },2000);
            return () => clearTimeout(timer);
        }
    }, [successChangePassword]);
    
    const handleEditMode = () => {
        setEditModeMessage('');
        setSuccessedit('');
        setEditMode(true);
    }

    const handleChangePassword = () => {
        setChangePasswordMessage('');
        setSuccessChangePassword('');
        setChangePassword(true);
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/user/edit-profile/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setSuccessedit('Profile updated successfully');
                setEditMode(false);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile', { state: { user: data.user } });
            } else {
                setEditModeMessage(data.message);
                console.log(data);
            }
        } catch (err) {
            setEditModeMessage(data.message || 'An Error Occured While Updating Profile');
            console.log(err);
        }
    }

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/user/change-password/${user.email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(passwordData)
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                setChangePassword(false);
                setSuccessChangePassword('Password updated successfully');
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile', { state: { user: data.user } });
            } else {
                setChangePasswordMessage(data.message || 'Unable to update password');
                console.log(data);
            }
        } catch (err) {
            setChangePasswordMessage(data.message || 'An Error Occured While Updating Password');
            console.log(err);
        }
    }


    return (
        <div className="profile">
            
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

        {successedit && <p className="message">{successedit}</p>}
        {successChangePassword && <p className="message">{successChangePassword}</p>}
        <div className="profile_container">
            <h1>Profile</h1>
                <div>
                    <p className="profile_details"><strong>First Name:</strong> {user.firstName}</p>
                    <p className="profile_details"><strong>Last Name:</strong> {user.lastName}</p>
                    <p className="profile_details"><strong>Email:</strong> {user.email}</p>
                    <p className="profile_details"><strong>Contact Number:</strong> {user.contactNumber}</p>
                    <p className="profile_details"><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
                </div>
                <div className="profile_actions">
                    <button onClick={handleEditMode}>Edit Profile</button>
                    <button onClick={handleChangePassword}>Change Password</button>
                </div>
                <button onClick={handlelogout} className="logout">Logout</button>
        </div>
        {editMode && (
            <div className="update_form">
                <div className="update_content">
                    <h1>Update Profile</h1>
                    {editModeMessage && <p className="message">{editModeMessage}</p>}
                    <form onSubmit={handleUpdateProfile}>
                            <div >
                            <label>First Name:</label>
                            <input type="text" id="firstName" name="firstName" defaultValue={user.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}/>
                            </div>
                            <div >
                            <label>Last Name:</label>
                            <input type="text" id="lastName" name="lastName" defaultValue={user.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}/>
                            </div>
                            <div >
                            <label>Contact Number:</label>
                            <input type="tel" id="contactNumber" name="contactNumber" defaultValue={user.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}/>
                            </div>
                            <div >
                            <label>Date of Birth:</label>
                            <input type="date" id="dateOfBirth" name="dateOfBirth" defaultValue={user.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}/>
                            </div>
                        <button type="submit">Update</button>
                        <b>    </b>
                        <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                </div>
            </div>
        )}
        {changePassword && (
            <div className="update_form">
                <div className="update_content">
                    <h1>Change Password</h1>
                    {changePasswordMessage && <p className="message">{changePasswordMessage}</p>}
                    <form onSubmit={handleUpdatePassword}>
                        <label>Current Password:</label>
                        <input type="password" id="oldPassword" name="oldPassword" onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}/>
                        <label>New Password:</label>
                        <input type="password" id="newPassword" name="newPassword" onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}/>
                        <button type="submit">Change Password</button>
                        <b>  </b>
                        <button type="button" onClick={() => setChangePassword(false)}>Cancel</button>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
}

export default Profile;