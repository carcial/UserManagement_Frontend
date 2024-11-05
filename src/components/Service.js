import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

export default function Service({ hasAccount, name }) {
    const navigate = useNavigate();

    function goToSignup() {
        navigate("/signup");
    }

    return (
        <div className="home-page-container">
            {hasAccount ? (
                <div className="welcome-message">
                    <h1>Hey, <span>{name}</span>!</h1>
                    <p>Explore our exclusive services designed to help you make the most of our platform.
                        Enjoy a seamless experience tailored just for you.</p>
                </div>
            ) : (
                <div className="not-logged-in-message">
                    <h1>Access Restricted</h1>
                    <p>To explore our services, please log in first.</p>
                    <button onClick={goToSignup} className="login-button">Log In</button>
                </div>
            )}
        </div>
    );
}
