import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

export default function Home({ hasAccount, name }) {
    const navigate = useNavigate();

    function goToSignup() {
        navigate("/signup");
    }

    return (
        <div className="home-page-container">
            {hasAccount ? (
                <div className="welcome-message">
                    <h1>Welcome, <span>{name}</span>!</h1>
                    <p>We’re glad to have you on our platform. Explore the features and make the most out of your experience here.</p>
                </div>
            ) : (
                <div className="not-logged-in-message">
                    <h1>Welcome to Our Platform</h1>
                    <p>To access all features and start exploring, please log in to your account.</p>
                    <button onClick={goToSignup} className="login-button">Log In</button>
                </div>
            )}
        </div>
    );
}
