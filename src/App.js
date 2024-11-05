import './App.css';
import { Route, Routes, useNavigate } from "react-router-dom"
import { useState } from "react"
import Navbar from './components/Navbar';
import Home from "./components/Home"
import Service from "./components/Service"
import Contact from "./components/Contact"
import Profile from "./components/Profile"
import SignUp from "./components/SignUp"


function App() {

  const [logOut, setLogOut] = useState(false)

  const [hasAccount, sethasAccount] = useState(false)

  const [name, setName] = useState("")

  const [userId, setUserId] = useState("")

  const [pass, setPass] = useState("")

  const [authorised, isAuthorised] = useState(false)


  function reset(update) {
    setName(update)
  }

  function getId(id) {
    setUserId(id)
  }

  function getPass(pass) {
    setPass(pass)
  }

  function checkaccount(check) {
    sethasAccount(check)
  }

  function authority(value) {
    isAuthorised(value)
  }

  //console.log(datas[datas.length - 1])


  const navigate = useNavigate()

  function redirect() {
    setLogOut(true)
    navigate("/")
  }
  function goBackToSignUp() {
    setLogOut(false)
    navigate("/")
  }


  return (
    <main>

      <Navbar logs={logOut} red={goBackToSignUp}
        newName={name} getId={getId}
        authorised={authorised} authority={authority} />
      <Routes>
        <Route path='/' element={<Home hasAccount={userId} name={name} />} />
        <Route path='/service' element={<Service hasAccount={userId} name={name} />} />
        <Route path='/contact' element={<Contact isLogged={logOut} usId={userId} />} />
        <Route path='/profile' element={<Profile usId={userId} setUserName={reset}
          pass={pass} />} />
        <Route path='/signup' element={<SignUp red={redirect} reset={reset}
          getId={getId} getPass={getPass}
          check={checkaccount}
          hasAccount={hasAccount}
          hasAuthority={authority} />} />

      </Routes>
    </main>
  );
}

export default App;
