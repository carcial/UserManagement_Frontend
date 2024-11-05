import { useState } from 'react';
import Login from './Login';
import "../SignUp.css";
import { MdOutlineMail, MdOutlinePassword, MdOutlinePersonOutline, MdOutlineArrowBack } from "react-icons/md";

export const API_URL = "https://usermanagementbackend-production-ab31.up.railway.app/api/v1/user";

export default function SignUp(props) {
    const [name, setUserName] = useState("");
    const [surName, setUserSurName] = useState("");
    const [email, setUserEmail] = useState("");
    const [pass, setPass] = useState("");

    const [isField, setIsField] = useState(false);
    const [registrationOk, setRegistrationOk] = useState(false);

    const userObject = { name, surName, email, pass };

    const handleChange = (setter) => (event) => setter(event.target.value);

    const testIfInputEmpty = () => {
        const isComplete = Object.values(userObject).every((field) => field.trim() !== "");
        setIsField(isComplete);
        return isComplete;
    };

    const addUser = () => {
        if (testIfInputEmpty()) {
            fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userObject),
            })
                .then((res) => res.text())
                .then(() => setRegistrationOk(true))
                .catch(console.log);

            setUserName("");
            setUserSurName("");
            setUserEmail("");
            setPass("");
            setTimeout(() => returnToLogin(), 2000);
        }
    };

    const returnToLogin = () => {
        props.check(false);
        setRegistrationOk(false);
    };

    return (
        <section className="registration-container">
            {registrationOk && (
                <div className="registration-success-message">
                    <h5>Registration Successful</h5>
                </div>
            )}
            {props.hasAccount ? (
                <div className="registration-form-container">
                    <h1 className="registration-title">Create Your Account</h1>
                    <form className="input-form">
                        <div className="input-group">
                            <label><MdOutlinePersonOutline /> First Name</label>
                            <input type="text" placeholder="Enter your first name" value={name} onChange={handleChange(setUserName)} required />
                        </div>
                        <div className="input-group">
                            <label><MdOutlinePersonOutline /> Last Name</label>
                            <input type="text" placeholder="Enter your last name" value={surName} onChange={handleChange(setUserSurName)} />
                        </div>
                        <div className="input-group">
                            <label><MdOutlineMail /> Email</label>
                            <input type="email" placeholder="Enter your email" value={email} onChange={handleChange(setUserEmail)} />
                        </div>
                        <div className="input-group">
                            <label><MdOutlinePassword /> Password</label>
                            <input type="password" placeholder="Enter your password" value={pass} onChange={handleChange(setPass)} />
                        </div>
                    </form>
                    {!isField && <p className="error-message">Please complete all fields.</p>}
                    <div className="button-group">
                        <button className="register-button" onClick={addUser}>Register</button>
                        <button className="return-button" onClick={returnToLogin}><MdOutlineArrowBack /> Login Now</button>
                    </div>
                </div>
            ) : (
                <Login check={props.check} red={props.red} setName={props.reset} getsId={props.getId} getPass={props.getPass} hasAuth={props.hasAuthority} />
            )}
        </section>
    );
}
