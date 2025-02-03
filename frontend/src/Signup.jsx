import React, { useState, useRef } from "react";
import "./Auth.css";
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { MdDialpad } from "react-icons/md";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import iiit from "./assets/iiit-new.png";
import ReCAPTCHA from "react-google-recaptcha";

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [dateOfBirth, setDOB] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [captcha, setCaptcha] = useState(null);
    const recaptchaRef = useRef(null);

    const handlesignup = async (e) => {
        e.preventDefault();
        setError('');
        if(!captcha) {
            setError('Please verify that you are not a robot');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstName, lastName, email, contactNumber, password, dateOfBirth , captcha })
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile', { state: { user: data.user } });
            } else {
                setError(data.message);
                setFirstName('');
                setLastName('');
                setEmail('');
                setContactNumber('');
                setPassword('');
                setDOB('');
                recaptchaRef.current?.reset();
                setCaptcha(null);
            }
        } catch (err) {
            setError(data.message || 'An Error Occured While Signing Up');
            setFirstName('');
            setLastName('');
            setEmail('');
            setContactNumber('');
            setPassword('');
            setDOB('');
            recaptchaRef.current?.reset();
            setCaptcha(null);
        }
        
        };
    return (
        <div className="Authentication_box">
            <img src={iiit} alt="" />
            <form onSubmit={handlesignup}>
                <h1>Sign Up</h1>
                <div className="input_box">
                    <input type="text" placeholder="First Name" required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                    <input type="text" placeholder="Last Name" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                </div>
                
                <div className="input_box">
                    <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <MdOutlineMail className="Icon" />
                </div>
                <div className="input_box">
                    <input type="tel" placeholder="Contact Number" required value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}/>
                    <MdDialpad  className="Icon" />
                </div>
                <div className="input_box">
                    <input className="date" type="date" placeholder="Date of Birth" required value={dateOfBirth} onChange={(e) => setDOB(e.target.value)}/>
                </div>
                <div className="input_box">
                    <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)}/> 
                    <TbLockPassword className="Icon" />   
                </div>
                <div className="captcha">
                <ReCAPTCHA
                    sitekey="6Lc9SsoqAAAAAHJQ5YPNNRQtbkowIAYzbr1hTfeM"
                    onChange={(value) => setCaptcha(value)}
                    ref={recaptchaRef}
                />
                </div>
                {error && <p className="error_message">{error}</p>}
                <button type="submit">Sign Up</button>
                <p className="Alternate">Already have an account? <Link to="/" className="a">Login</Link></p>
            </form>
        </div>
    );
}

export default Signup;