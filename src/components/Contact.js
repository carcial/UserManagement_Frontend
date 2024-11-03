import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconContext } from "react-icons"
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr"
import { TbPlayerTrackPrevFilled } from "react-icons/tb"
import { AiTwotoneDelete } from "react-icons/ai"
import { CgProfile } from "react-icons/cg"
import { CiSearch } from "react-icons/ci"
import "../Contact.css"
import { API_URL } from './SignUp'


export default function Contact(props) {



    const [pageNumber, setPageNumber] = useState(1);
    const [lastPageNumber, setLastPageNumber] = useState(0)

    const [userData, setUserData] = useState([])
    const [allUserData, setAllUserData] = useState([])
    const [seeUser, setSeeUser] = useState(false)
    const [clickedUser, setClickedUser] = useState({})
    const [profilePic, setProfilePic] = useState("")

    const [inputValue, setInputValue] = useState("")

    const [deleteSuccessful, setDeleteSuccessful] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)



    const navigate = useNavigate()

    function handleChangeInput(event) {

        setInputValue(event.target.value)
    }


    function getDataFromBackend() {
        fetch(`${API_URL}/see_users/${props.usId}`)
            .then(resp => resp.json())
            .then(data => {

                let dataArr = []

                data.forEach((element) => {
                    if (element.page === pageNumber) {
                        dataArr.push(element)
                    }
                })
                setLastPageNumber(data[data.length - 1].page)
                setUserData(dataArr)
                setAllUserData(data)

            })
            .catch(err => console.log(err))
    }

    function getProfilePic(id) {
        fetch(`${API_URL}/getImage/${id}`)
            .then(resp => {
                if (!resp.ok) {
                    console.log("no image was found")
                    setProfilePic("")
                }
                else {
                    setProfilePic(`http://3.120.151.136:8082/api/v1/user/getImage/${id}`)
                }
                resp.blob()
            })
            .then(data => {

                console.log(data)
            })
            .catch(err => console.log(err))
    }

    function clickOnUser(userId) {
        allUserData.forEach(element => {
            if (element.id === userId) {
                setSeeUser(true)
                setClickedUser(element)
                getProfilePic(userId)
            }
        })
    }

    function deleteUserAccount(email) {
        console.log("clicked email", email)
        fetch(`${API_URL}/deleteUser/${email}/${props.usId}`,
            {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            .then(resp => resp.text())
            .then(data => {
                if (data === "success") {
                    console.log(data)
                    setDeleteSuccessful(true)
                }
            })
            .catch(err => console.log(err))
        getDataFromBackend()
        setSeeUser(false)
        setShowConfirmation(false)
    }

    function returnToContactTable() {
        setSeeUser(false)
    }


    function nextPage() {
        if (pageNumber <= lastPageNumber) {
            setPageNumber(pageNumber + 1)
        }
    }

    function previousPage() {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1)
        }
    }


    useEffect(() => {
        getDataFromBackend()
        setDeleteSuccessful(false)
    }, [pageNumber, lastPageNumber, deleteSuccessful])

    function goToSignup() {
        navigate("/signup")
    }

    return (
        <section className='page-container contact-page-container'>

            {props.isLogged && !seeUser &&
                <div className='search-bar-container'>
                    <div className='input-container'>
                        <input type="text" placeholder='search name or mail' onChange={handleChangeInput} value={inputValue} />
                        <CiSearch fontSize="30px" />
                    </div>
                    <div className={`display-seach ${inputValue === "" ? "empty" : ""}`}>
                        {allUserData.filter(user =>
                            user.name.toLowerCase().includes(inputValue.toLowerCase())
                            || user.email.toLowerCase().includes(inputValue.toLowerCase())).map((user) =>
                            (<div key={user.id} onClick={() => clickOnUser(user.id)} className="searched-user">
                                <h2>{user.name}</h2>
                                <h4>{user.email}</h4>
                            </div>
                            ))
                        }
                    </div>
                </div>
            }
            {(seeUser && showConfirmation) &&
                (<div className='delete-confirmation-container'>
                    <h3>
                        The user
                        "<span>{clickedUser.email}</span>"
                        will be deleted from the Database,
                        are you shure ?
                    </h3>
                    <div className='delete-confirmation-button-container'>
                        <button className='delete-button' onClick={() => deleteUserAccount(clickedUser.email)}>
                            YES
                        </button>
                        <button onClick={() => setShowConfirmation(false)}>NO</button>
                    </div>
                </div>)
            }

            {props.isLogged ?
                (<IconContext.Provider value={{ className: "about-container" }}>
                    {seeUser ?
                        (<div className={`user-detail-container ${showConfirmation ? "confirm" : ""}`}>
                            <div className='user-detail-infos'>
                                {profilePic ? <div className='user-detail-infos-image'><img src={profilePic} alt="nothing" /></div>
                                    : <div className='user-detail-infos-image'><CgProfile className='profilePic' /></div>}
                                <div className='clicked-user-meta-infos'>
                                    <div className='lab'>
                                        <label>First Name :</label>
                                        <h2>{clickedUser.name}</h2>
                                    </div>
                                    <div className='lab'>
                                        <label>Second Name :</label>
                                        <h2>{clickedUser.surName}</h2>
                                    </div>
                                    <div className='lab'>
                                        <label>Email :</label>
                                        <h2>{clickedUser.email}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className='return-and-delete-account'>
                                <button className='delete-button' onClick={() => setShowConfirmation(true)}><AiTwotoneDelete />delete account</button>
                                <button onClick={returnToContactTable} ><TbPlayerTrackPrevFilled />return</button>
                            </div>
                        </div>)
                        :
                        (<div className='contact-table'>

                            <div className='button-pages-container'>
                                {pageNumber !== 1 && <GrLinkPrevious cursor="pointer" onClick={previousPage} />}
                                <div className='current-page-number'>
                                    <h1 className='active-pageNumber'>{pageNumber}</h1>
                                    <h1>{lastPageNumber}</h1>
                                </div>
                                {pageNumber < lastPageNumber && <GrLinkNext cursor="pointer" onClick={nextPage} />}
                            </div>

                            <table>
                                <thead>
                                    <tr>
                                        <th>First Name</th>
                                        <th>Second Name</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                {userData.map((element) => (

                                    <tbody key={element.id}>
                                        <tr key={element.id} onClick={() => clickOnUser(element.id)} className="user-table-row">
                                            <td>{element.name}</td>
                                            <td>{element.surName}</td>
                                            <td>{element.email}</td>
                                        </tr>
                                    </tbody>

                                ))}
                            </table>
                        </div>)}
                </IconContext.Provider>)
                :
                <div className='not-logged-container'>
                    <h2><p>Must Login</p></h2>
                    <button onClick={goToSignup}>Login</button>
                </div>
            }


        </section>
    )
}
