import React, { useState, useRef } from 'react';
import './Auth.css'
import { MdOutlineMail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { data, Link } from 'react-router-dom';
import iiit from "./assets/iiit-new.png"
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [captcha, setCaptcha] = useState(null);
    const recaptchaRef = useRef(null);

    const handlelogin = async (e) => {
        e.preventDefault();
        setError('');
        if(!captcha) {
            setError('Please verify that you are not a robot');
            return;
        }
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email , password, captcha })
            });
            const data = await response.json();
            if(response.ok) {
                console.log(data);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/profile', { state: { user: data.user } });
            } else {
                setError(data.message);
                setEmail('');
                setPassword('');
                recaptchaRef.current?.reset();
                setCaptcha(null);
            }
        } catch (err) {
            setError( data.message || 'An Error Occured While Logging In');
            setEmail('');
            setPassword('');
            recaptchaRef.current?.reset();
            setCaptcha(null);
        }
    };
    return (
        <div className='Authentication_box'>
            <img src={iiit} alt="iiith" />
            <form onSubmit={handlelogin}>
                <h1>Login</h1>
                <div className="input_box">
                    <input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <MdOutlineMail className='Icon' />
                </div>
                <div className="input_box">
                    <input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <TbLockPassword className='Icon' />
                </div>
                <div className="captcha">
                <ReCAPTCHA
                    sitekey="6Lc9SsoqAAAAAHJQ5YPNNRQtbkowIAYzbr1hTfeM"
                    onChange={(value) => setCaptcha(value)}
                    ref={recaptchaRef}
                />
                </div>
                {error && <p className='error_message'>{error}</p>}
                <button type='submit'>Login</button>
                <p className='Alternate'>Don't have an account?<Link to="/Signup" className='a'>Sign Up</Link></p>

            </form>
        </div>
    );
};

export default Login