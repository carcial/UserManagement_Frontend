import React, { useEffect, useState, useRef } from 'react'
import { IconContext } from "react-icons"
import { CgProfile } from "react-icons/cg"
import { FaCamera } from "react-icons/fa"
import { AiOutlineCheck } from "react-icons/ai"
import { MdOutlineCancel, MdOutlineMail, MdOutlinePassword, MdOutlinePersonOutline } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { AiTwotoneDelete } from "react-icons/ai"
import "../Profile.css"


export default function Profile(props) {

    const [image, setImage] = useState("")
    const [profilePic, setProfilePic] = useState({})
    const [imageDisplay, setImageDisplay] = useState("")
    const [successMessage, setSuccessMessage] = useState(false)

    const [name, setName] = useState("")
    const [surName, setSurName] = useState("")
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")


    const inputFileRef = useRef(null)


    const id = props.usId

    const navigate = useNavigate()

    function redirectToSignup() {
        navigate("/signup")
    }

    function chooseImage() {
        inputFileRef.current.click()

    }

    function handleChangeName(event) {
        setName(event.target.value)
    }
    function handleChangeSurName(event) {
        setSurName(event.target.value)
    }
    function handleChangeEmail(event) {
        setEmail(event.target.value)
    }
    function handleChangePassword(event) {
        setPass(event.target.value)
    }

    function handleChangeFile(event) {
        const file = event.target.files[0];
        setImage(file)

        const reader = new FileReader();
        reader.onload = () => {
            setProfilePic(reader.result);
        };
        reader.readAsDataURL(file);
    }


    function saveImage() {

        const formData = new FormData()
        formData.append("image", image)
        if (image) {
            fetch(`http://3.120.151.136:8082/api/v1/user/upload/${id}`,
                {
                    method: "PUT",
                    body: formData
                })
                .then(resp => resp.text())
                .then(data => {
                    console.log("message : " + data)

                })
                .catch(err => console.log(err))
            setImage("")
            setImageDisplay(profilePic)
        }
    }

    function getProfilePic() {
        fetch(`http://3.120.151.136:8082/api/v1/user/getImage/${id}`)
            .then(resp => {
                if (!resp.ok) {
                    console.log("no image was found")
                    setImageDisplay("")
                }
                else {
                    setImageDisplay(`http://3.120.151.136:8082/api/v1/user/getImage/${id}`)
                }
                resp.blob()
            })
            .then(data => {

                console.log(data)
            })
            .catch(err => console.log(err))
    }

    function getUserData() {
        fetch(`http://3.120.151.136:8082/api/v1/user/getUser/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setName(data.name)
                setSurName(data.surName)
                setEmail(data.email)
                setPass(props.pass)

            })
            .catch(err => console.log(err))
    }

    function saveEditedUserData() {
        fetch(`http://3.120.151.136:8082/api/v1/user/saveChanges/${id}
                ?name=${name}&surName=${surName}&email=${email}&pass=${pass}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name })
            })
            .then(resp => resp.json())
            .then(data => {
                // console.log("edited data: " + data.name)
                if (data.name === name) {
                    setSuccessMessage(true)
                    setTimeout(() => setSuccessMessage(false), 2000)
                    props.setUserName(name)
                }
                else {
                    setSuccessMessage(false)
                }
            })
            .catch(err => console.log(err))

    }

    function closePreviewImgae() {
        setProfilePic("")
    }

    useEffect(() => {
        if (id) {
            getProfilePic()
            getUserData()
            setTimeout(() => console.log("time set"), 5000)
        }
    }, [])



    return (
        <section className='Profile-main-container'>

            {!id ?
                (<div className='not-logged-container'>

                    <h2><p>Must Login</p></h2>
                    <button onClick={() => redirectToSignup()}>Login</button>
                </div>)
                :
                (<IconContext.Provider value={{ className: "Profile-container" }}>
                    <div className='Profile-container'>
                        <div className='Profile-subcontainer'>

                            <div className='image-and-button-container '>
                                <div className='image-container'>
                                    {!imageDisplay ? (<CgProfile className='profilePic' />)
                                        :
                                        (<div className='profilePic'>
                                            <img src={imageDisplay} alt="nothing" />

                                        </div>)}
                                    <div className='saveImage-container'>
                                        <input type="file" ref={inputFileRef} onChange={handleChangeFile} />
                                        <FaCamera className='camera-tag' onClick={() => chooseImage()} />
                                        <div className='save-delete-button-container'>
                                            <button onClick={() => { saveImage() }}>save image</button>

                                        </div>
                                    </div>
                                    <div className='Profile-lab-email'>
                                        <label>email</label>
                                        <span>{email}</span>
                                    </div>
                                </div>

                                <div className='preview-profilePic-container'>
                                    {image && profilePic ?
                                        <div className='preview-profilePic'>
                                            <MdOutlineCancel color='red' cursor="pointer" onClick={closePreviewImgae} />
                                            <img className='vueOfProfilePic' src={profilePic} alt="nothing" />
                                        </div>
                                        :
                                        <h3>preview image</h3>}
                                </div>
                                <button className='delete-button'><AiTwotoneDelete />delete account</button>
                            </div>
                        </div>
                        <div className='Profile-subcontainer2'>
                            <h1>Account</h1>

                            <div className='Profile-container2-data'>
                                <div className='user-infos'>
                                    <div className='lab'>
                                        <MdOutlinePersonOutline className='person-icon' />
                                        <label> First Name </label>
                                    </div>
                                    <input type="text" value={name}
                                        onChange={handleChangeName} />
                                </div>

                                <div className='user-infos'>
                                    <div className='lab'>
                                        <MdOutlinePersonOutline className='person-icon' />
                                        <label> Second Name </label>
                                    </div>

                                    <input type="text" value={surName}
                                        onChange={handleChangeSurName} />
                                </div>

                                <div className='user-infos'>
                                    <div className='lab'>
                                        <MdOutlineMail className='email-icon' />
                                        <label> Email </label>
                                    </div>

                                    <input type="email" value={email}
                                        onChange={handleChangeEmail} />
                                </div>
                                <div className='user-infos'>
                                    <div className='lab'>
                                        <MdOutlinePassword className='password-icon' />
                                        <label> Password </label>
                                    </div>

                                    <input type="text" value={pass}
                                        onChange={handleChangePassword} />
                                </div>
                            </div>

                            <div className='changes-button-container'>
                                <div className={`message ${successMessage ? "success" : ""}`}><span>saved successfully</span><AiOutlineCheck color='green' /></div>

                                <button onClick={() => saveEditedUserData()}>Save Changes</button>
                            </div>

                        </div>
                    </div>
                </IconContext.Provider>
                )

            }
        </section>
    )
}
