import React from 'react'
import { useState } from 'react';
import { MdOutlineMail, MdOutlinePassword, MdOutlineArrowForward } from "react-icons/md"

export default function Login(props) {

    const [email, setUserEmail] = useState("");
    const [pass, setPass] = useState("");


    const [isField, setIsField] = useState(false)
    const [errUser, setErrUser] = useState(false)

    const userObject = { email, pass }

    let roles = []
    let userIdForRole = ""

    let countFieldInput = Object.keys(userObject).length


    function handleChangeEmail(event) {
        setUserEmail(event.target.value)
    }
    function handleChangePassword(event) {
        setPass(event.target.value)
    }


    function testIfInputEmpty() {

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

    function redirect() {
        props.red()
    }

    function setName(name) {
        props.setName(name)
    }


    function loginSuccessful() {
        testIfInputEmpty()
        if (countFieldInput === 0) {
            fetch("http://3.120.151.136:8082/api/v1/user/login",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userObject)
                })
                .then(resp => resp.json())
                .then(data => {
                    if (data.message === "success") {
                        props.getsId(data.id);
                        userIdForRole = data.id;
                        props.getPass(data.pass)
                        setName(data.name);
                        redirect();
                        setErrUser(false);
                        getRoles();

                        console.log(data.id)
                    }
                    else {
                        setErrUser(true);
                    }
                })
                .catch(err => console.log(err))
        }


    }

    function getRoles() {
        fetch(`http://3.120.151.136:8082/api/v1/user/getRoles/${userIdForRole}`)
            .then(resp => resp.json())
            .then(data => {
                roles = data;
                authority();
                console.log("all roles: ", roles)
            })
            .catch(err => console.log(err))
    }

    function authority() {
        roles.map(role => {
            if (role.roleName === "ADMIN") {
                auth(true)
            }
            if (role.roleName === "MANAGER") {
                auth(true)
            }
        })
    }

    function auth(value) {
        props.hasAuth(value)
    }


    function checkaccount() {
        props.check(true)
    }

    return (
        <div className='login-main-container'>

            <form className='all-input-container'>
                <div className=' login-input'>
                    <label><MdOutlineMail />Email*</label>
                    <input type="email"
                        value={email}
                        placeholder='enter your email'
                        onChange={handleChangeEmail} />
                </div>
                <div className=' login-input'>
                    <label><MdOutlinePassword /> Password*</label>
                    <input type="password"
                        value={pass}
                        placeholder='enter your passwor'
                        onChange={handleChangePassword} />
                </div>
            </form>
            <p className={`${!isField ? "no-black-places" : "black-places"}`}>No Empty Spot Please</p>
            <p className={`${errUser ? "error-msg" : "no-err"}`}>An error in Email or password </p>
            <div className='login-button-container'>
                <button onClick={() => { loginSuccessful() }}>Log-In</button>
                <button onClick={checkaccount}>Register <MdOutlineArrowForward /></button>
            </div>

        </div>
    )
}
