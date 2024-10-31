import React from 'react'
import { useState } from 'react'
import { IconContext } from "react-icons"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { BsFillPersonFill } from "react-icons/bs"
import "../App.css"

export default function Logout(props) {

    const [isDroped, setIsDrope] = useState(false)


    function checkIfDroped() {
        setIsDrope(!isDroped)
    }

    return (
        <div className='logout-container'>
            <IconContext.Provider value={{ className: "drop-down" }}>
                <button onClick={checkIfDroped} className="user-name">
                    <BsFillPersonFill className='header-person-icon' />
                    {props.username}
                    {!isDroped ? <MdArrowDropDown fontSize="30px" /> : <MdArrowDropUp fontSize="30px" />}
                </button>
                <button onClick={() => {
                    props.redi();
                    props.getUsId("");
                    props.authority(false)
                }} className={`logout ${isDroped ? "visible" : ""}`}>
                    Logout
                </button>
            </IconContext.Provider>
        </div>
    )
}
