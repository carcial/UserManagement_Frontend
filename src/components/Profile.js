import React, { useEffect, useState } from 'react';
import { IconContext } from 'react-icons';
import { CgProfile } from 'react-icons/cg';
import { FaCamera } from 'react-icons/fa';
import { AiOutlineCheck, AiTwotoneDelete } from 'react-icons/ai';
import { MdOutlineCancel, MdOutlineMail, MdOutlinePassword, MdOutlinePersonOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Profile.css';
import { API_URL } from './SignUp';

export default function Profile(props) {
    const [image, setImage] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [imageDisplay, setImageDisplay] = useState('');
    const [successMessage, setSuccessMessage] = useState(false);
    const [name, setName] = useState('');
    const [surName, setSurName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    //const inputFileRef = useRef(null);
    const id = props.usId;
    const navigate = useNavigate();

    const handleChangeFile = (event) => {
        const file = event.target.files[0];
        setImage(file);
        const reader = new FileReader();
        reader.onload = () => setProfilePic(reader.result);
        reader.readAsDataURL(file);
    };

    const saveImage = () => {
        if (image) {
            const formData = new FormData();
            formData.append('image', image);
            fetch(`${API_URL}/upload/${id}`, { method: 'PUT', body: formData })
                .then(() => setImageDisplay(profilePic))
                .catch(console.log);
            setImage('');
        }
    };

    function getProfilePic() {
        fetch(`${API_URL}/getImage/${id}`)
            .then(resp => {
                if (!resp.ok) {
                    setImageDisplay("")
                }
                else {
                    setImageDisplay(`${API_URL}/getImage/${id}`)
                }
                resp.blob()
            })
            .then(data => {

                console.log(data)
            })
            .catch(err => console.log(err))
    }


    const saveEditedUserData = () => {
        fetch(`${API_URL}/saveChanges/${id}?name=${name}&surName=${surName}&email=${email}&pass=${pass}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, surName, email, pass }),
        })
            .then(resp => resp.json())
            .then(data => {
                if (data.name === name) {
                    setSuccessMessage(true);
                    setTimeout(() => setSuccessMessage(false), 2000);
                    props.setUserName(name);
                } else {
                    setSuccessMessage(false);
                }
            })
            .catch(console.log);
    };

    const getUserData = () => {
        fetch(`${API_URL}/getUser/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setName(data.name);
                setSurName(data.surName);
                setEmail(data.email);
                setPass(props.pass);
            });
    };
    function closePreviewImage() {
        setProfilePic("")
        // Reset the file input field
        const fileInput = document.getElementById("fileInput")
        if (fileInput) {
            fileInput.value = ""; // Clear the input value so that the same file can be selected again
        }
    }

    useEffect(() => {
        if (id) {
            getUserData();
            getProfilePic()
        }
    }, []);

    return (
        <section className="profile-main-container">
            {!id ? (
                <div className="not-logged-container">
                    <h2>Must Login</h2>
                    <button onClick={() => navigate('/signup')}>Login</button>
                </div>
            ) : (
                <IconContext.Provider value={{ className: 'icon' }}>
                    <div className="profile-container">
                        <div className="image-section">
                            <div className="profile-pic">
                                {imageDisplay ? (
                                    <img src={imageDisplay} alt="Profile" />
                                ) : (
                                    <CgProfile className="default-pic" />
                                )}
                                <input type="file" id="fileInput" onChange={handleChangeFile} style={{ display: "none" }} />
                                <FaCamera className="camera-icon" onClick={() => document.getElementById('fileInput')?.click()} />
                            </div>
                            <button className="save-button" onClick={saveImage}>Save Image</button>
                            <button className="delete-button"><AiTwotoneDelete /> Delete Account</button>

                            {/* Preview Section */}
                            {profilePic && (
                                <div className="preview-profilePic-container">
                                    <div className="preview-profilePic">
                                        <MdOutlineCancel color="red" cursor="pointer" onClick={closePreviewImage} />
                                        <img className="vueOfProfilePic" src={profilePic} alt="Preview" />
                                    </div>
                                </div>
                            )}
                        </div>


                        <div className="info-section">
                            <h2>Account Details</h2>
                            <div className="input-group">
                                <MdOutlinePersonOutline className="input-icon" />
                                <input type="text" placeholder="First Name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <MdOutlinePersonOutline className="input-icon" />
                                <input type="text" placeholder="Last Name" value={surName} onChange={(e) => setSurName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <MdOutlineMail className="input-icon" />
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <MdOutlinePassword className="input-icon" />
                                <input type="password" placeholder="Password" value={pass} onChange={(e) => setPass(e.target.value)} />
                            </div>
                            <button className="save-button" onClick={saveEditedUserData}>Save Changes</button>
                            {successMessage && <div className="success-message"><AiOutlineCheck /> Changes Saved</div>}
                        </div>
                    </div>
                </IconContext.Provider>
            )}
        </section>
    );
}
