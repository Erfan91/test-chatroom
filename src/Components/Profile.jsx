import React, { useEffect, useState } from 'react'
import { stringify } from "flatted"
import axios from "axios"
import img from "../images/téléchargement.jpeg"
import { useParams, Params } from 'react-router-dom'
import { BiMessageSquareAdd } from "react-icons/bi"
import { IoSend } from "react-icons/io5";
import Room from './Room'
const Profile = () => {
  const params = useParams();
  //(user)  the connected user data is stored in user state.
  const [user, setUser] = useState([]);
  // (about) user's bio is stored in about state and will be sent to db 
  const [userAbout, setAbout] = useState('');
  // (users) this state contains all users to add in message box
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("user's name");
  const [btnDisplay, setBtnDisplay] = useState('none');
  const [divDisplay, setDivDisplay] = useState('none');
  //  (submit) once user's click on upload button after choosing image, by changing the state to true upload button is replaced with submit image which regieters image as profile image 
  const [submit, setSubmit] = useState(null)
  const [reqName, setReqName] = useState(params.username)
  const [msgDisplay, setMsgDisplay] = useState('none');
  const [message, setMessage] = useState("");
  const [msgDestId, setMsgDtId] = useState('');
  const [msgList, setMsgList] = useState([]);
  const [userId, setUserId] = useState("")
  const upName = name
  const id = JSON.stringify(localStorage.getItem('id'))
  const ids = JSON.parse(id)

  useEffect(() => {
    fetch("http://localhost:3001/user/" + reqName)
      .then(result => result.json())
      .then(json => {
        // console.log(json, "JSON")
        setUser([json])
        setName(json.name)
        setUserId(json._id)
      })
  }, [])

  const getUser = () => {
    fetch("http://localhost:3001/user/" + reqName)
      .then(result => result.json())
      .then(json => {
        // console.log(json, "JSON")
        setUser([json])

      })
  }


  const bioSender = e => {
    e.preventDefault()
    fetch("http://localhost:3001/user/about", {
      method: "PUT",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username: params.username,
        about: userAbout
      })
    }).then(result => result.json())
      .then(json => {
        // console.log(json)
      })
    getUser()
  }

  const bioChanger = e => {
    e.preventDefault()
    setAbout(e.target.value)
  }

  useEffect(() => {
    fetch("http://localhost:3001/user")
      .then(result => result.json())
      .then(json => {
        // console.log(json, 'JSON USers')
        setUsers(json)
      })

  }, [])
  const uploadedImage = React.useRef(null)
  const imageUploader = React.useRef(null);
  const [myImage, setImage] = useState('');
  const [file, setFile] = useState('');
  const [display, setDisplay] = useState('block')
  const imageChanger = e => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      const { current } = uploadedImage;
      setImage(e.target.files[0])
      current.file = file;
      reader.onload = e => {
        current.src = e.target.result
      }
      reader.readAsDataURL(file);
    }
  }

  //  this function sends the image file to back and receives the url/path of the image back from multer, then it is ready to be sent and registred as a profile image. 
  const uploadImage = e => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('myImage', myImage)
    axios({
      method: "post",
      url: 'http://localhost:3001/user/upload-image',
      data: formData
    })
      .then(result => {
        const { data } = result;
        setFile(data.url)

      })
      .catch(err => {
        console.log(err)
      })
    setDisplay('none')
    setDivDisplay("flex")
    setSubmit(true)
  }
  const sendImage = async e => {
    await fetch("http://localhost:3001/user/user_image", {
      method: "PUT",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        username: params.username,
        url: file
      })
    }).then(result => result.json())
      .then(json => {
        // console.log(json)
      })
    getUser()
  }

  const messageInputDisplay = (userId) => {
    if (msgDisplay == "none") {
      setMsgDisplay('flex')
    }
    if (msgDisplay == "flex") {
      setMsgDisplay('none')
    }

  }

  const messageChanger = e => {
    e.preventDefault()
    setMessage(e.target.value)
  }

  const messageSender = async e => {
    e.preventDefault()
    await fetch('http://localhost:3001/msg', {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        sender: userId,
        receiver: msgDestId,
        content: message
      })
    }).then(result => result.json())
      .then(json => {
        // console.log(json)

      })
    await setMsgList(msgList => [...msgList, message])
  }

  return (
    <div className='profile-main-div'>
      <div className='profile-info-div'>
        <div className='user-info-div'>
          {user.map(user => {
            return (
              <>
                {!user.image ?
                  <>
                    <span className='user-about-span'> Welcome <span className='name-inner-span'>{upName[0].toUpperCase() + name.slice(1)}</span>! choose a profile image to get started</span>
                    <div className='upload-first-div'>
                      <input type="file" accept='/image*' ref={imageUploader} onChange={imageChanger} style={{ display: 'none' }} />
                      <div className='upload-second-div' onClick={() => {
                        imageUploader.current.click()
                        setDisplay('none')
                        setBtnDisplay('inline-block')
                      }}>
                        <img ref={uploadedImage} className='uploaded-image' />
                        <span className='upload-span' style={{ display: display }}>+</span>
                      </div>
                      {submit ? <button onClick={sendImage} className='upload-btn' style={{ display: btnDisplay }}>Submit image</button> : <button onClick={uploadImage} className='upload-btn' style={{ display: btnDisplay }}>Upload</button>}
                    </div></> :
                  <div className='user-image-container'>
                    <img src={user?.image} className='uploaded-image' />
                    <span className='user-name-span'>{user.name[0].toUpperCase() + user.name.slice(1)}</span>
                    <span className='user-username-span'>@{user.username}</span>
                  </div>
                }
                {!user.about ?
                  <div className='user-about-div' style={{ display: divDisplay }}>
                    <div>
                      <span className='about-span'>write something about yourself</span>
                      <textarea cols={5} rows={4} placeholder='I am a Boss😎' onChange={bioChanger} />
                    </div>
                    <button onClick={bioSender} className='submit-btn'>Submit</button>
                  </div> : <span className='user-about-span'>{user.about}</span>}

                {params.username == user.username ? <span style={{ display: "none" }}></span> :
                  <div className="user-avatar-div">
                    <span className='add-msg-span' onClick={messageInputDisplay}><BiMessageSquareAdd className="message-icon" /></span>
                    <span className='msg-text'>Message</span>
                    <div className='send-msg-div' style={{ display: msgDisplay }}>
                      <img src={user.image} className='user-msg-image' />
                      <input type="text" className='msg-input' onChange={messageChanger} />
                      <span onClick={messageSender}><IoSend className='send-msg-icon' /></span>
                    </div>
                    <div className='current-msg-div' style={{display: msgDisplay}}>
                      {
                        msgList.map(msg => {
                          return (
                            <span className='current-msg-span'>{msg}</span>
                          )
                        })
                      }
                    </div>
                  </div>}

              </>

            )
          })
          }
        </div>

      </div>
      <div className="find-users-div">
        {
          users.map(user => {
            return (
              <>
                {user.username == params.username ? <span style={{ display: 'none' }}></span> :
                  <div className='add-user-div' onClick={() => { setUser([user]); setMsgDtId(user._id); }}>
                    <img src={user?.image} className='add-user-image' />
                    <span className='user-sm-name-span'>{user.name}</span>
                    <span className='user-username-span'>@{user.username}</span>
                  </div>
                }
              </>
            )
          })
        }
      </div>
      <Room/>
    </div>
  )
}

export default Profile