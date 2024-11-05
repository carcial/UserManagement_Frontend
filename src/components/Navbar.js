import React from 'react'
import { NavLink } from "react-router-dom"
import { IconContext } from "react-icons"
import { GiHamburgerMenu } from "react-icons/gi"
import { AiOutlineCloseSquare } from "react-icons/ai"
import { useState } from 'react'
import Logout from './Logout'
import "../Navbar.css"

export default function Navbar(props) {

    const [isActive, setIsActive] = useState(false)

    function hamburger() {
        setIsActive(!isActive)
    }



    return (
        <header>
            <IconContext.Provider value={{ className: "open-clos" }}>
                <NavLink to="/" className="logo">Logo</NavLink>

                <nav className={`nav-tag ${isActive ? "toggled" : ""}`}>
                    <NavLink to="/" className="link">Home</NavLink>
                    <NavLink to="/service" className="link">Service</NavLink>
                    {props.logs &&
                        <>
                            <NavLink to="/profile" className="link">Profile</NavLink>
                            {props.authorised &&
                                <>
                                    <NavLink to="/contact" className="link">All Users</NavLink>
                                </>}
                        </>}
                    {props.logs ? <Logout redi={props.red} username={props.newName} getUsId={props.getId} authority={props.authority} />
                        :
                        <NavLink to="/signup" className="sign-up" >
                            Sign-Up
                        </NavLink>}
                </nav>

                <GiHamburgerMenu className={`open-tag ${isActive ? "toggled" : ""}`}
                    onClick={hamburger} />
                <AiOutlineCloseSquare className={`close-tag ${isActive ? "toggled" : ""}`}
                    onClick={hamburger} />
            </IconContext.Provider>
        </header >
    )
}
