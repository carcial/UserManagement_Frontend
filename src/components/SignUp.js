

import { useState } from 'react'
import Login from './Login';
import "../SignUp.css"
import { MdOutlineMail, MdOutlinePassword, MdOutlinePersonOutline, MdOutlineArrowBack } from "react-icons/md"

export const API_URL = "https://usermanagement-backend-ht6k.onrender.com/api/v1/user";

export default function SignUp(props) {

    const [name, setUserName] = useState("");
    const [surName, setUserSurName] = useState("");
    const [email, setUserEmail] = useState("");
    const [pass, setPass] = useState("");


    const [isField, setIsField] = useState(false)

    const [registratioOk, isRegistrationOk] = useState(false)

    const userObject = { name, surName, email, pass }

    let countFieldInput = Object.keys(userObject).length


    function handleChangeName(event) {
        setUserName(event.target.value)
    }
    function handleChangeSurName(event) {
        setUserSurName(event.target.value)
    }
    function handleChangeEmail(event) {
        setUserEmail(event.target.value)
    }
    function handleChangePassword(event) {
        setPass(event.target.value)
    }

    function testIfInputEmpty() {

        if (userObject.name !== "") {
            countFieldInput--
        }
        if (userObject.surName !== "") {
            countFieldInput--
        }
        if (userObject.email !== "") {
            countFieldInput--
        }
        if (userObject.pass !== "") {
            countFieldInput--
        }

        if (countFieldInput === 0) {
            setIsField(true)
        }
        else {
            setIsField(false)
        }
    }

    function username() {
        props.reset(userObject.name)
    }

    function getUsId(id) {
        props.getId(id)
    }

    function getPass(pass) {
        props.getPass(pass)
    }


    function addUser() {

        testIfInputEmpty()

        if (countFieldInput === 0) {
            fetch(`${API_URL}/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userObject)
                })
                .then(res => res.text())
                .then(data => { console.log(data); isRegistrationOk(true) })
                .catch(err => console.log(err))

            setUserName("")
            setUserSurName("")
            setUserEmail("")
            setPass("")
        }
        username()
        if (isField === true) {
            successfulRegistrationMessage()
        }
    }

    function returnToLogin() {
        props.check(false)
        isRegistrationOk(false)
    }

    function successfulRegistrationMessage() {
        setTimeout(() => returnToLogin(), 2000)
    }


    return (
        <section className='registration-container'>
            <div className={`${!registratioOk ? "registration-massage-fail" : "registration-massage-Success"}`}><h5>Registration Successful</h5></div>
            {!props.hasAccount ?
                <Login check={props.check} red={props.red} setName={props.reset} getsId={getUsId} getPass={getPass} hasAuth={props.hasAuthority} />
                :
                <div className='regis-sub-container'>
                    <div><h1 className='regis-title'>REGISTER</h1></div>
                    <form className='all-input-container'>
                        <div className='input-container'>
                            <label><MdOutlinePersonOutline /> Name*</label>
                            <input type="text"
                                placeholder='enter your name'
                                value={name}
                                required
                                onChange={handleChangeName} />
                        </div>
                        <div className='input-container'>
                            <label><MdOutlinePersonOutline /> Surname*</label>
                            <input type="text"
                                placeholder='enter your surname'
                                value={surName}
                                onChange={handleChangeSurName} />
                        </div>
                        <div className='input-container'>
                            <label><MdOutlineMail /> Email*</label>
                            <input type="email"
                                placeholder='enter your email'
                                value={email}
                                onChange={handleChangeEmail} />
                        </div>
                        <div className='input-container'>
                            <label><MdOutlinePassword /> Password*</label>
                            <input type="password"
                                placeholder='password'
                                value={pass}
                                onChange={handleChangePassword} />
                        </div>
                    </form>
                    <p className={`${!isField ? "no-black-places" : "black-places"}`}>No Empty Spot Please</p>
                    <div className='signup-button-container'>
                        <button onClick={() => { addUser() }} >Register</button>
                        <button onClick={returnToLogin}><MdOutlineArrowBack /> Login</button>
                    </div>
                </div>}
        </section>
    )
}
