import React, { useEffect, useState } from 'react';
import { TfiMore } from "react-icons/tfi";
import { IoIosArrowBack, IoIosMic } from "react-icons/io";
import { BsImage } from "react-icons/bs"
import { IoSend } from "react-icons/io5";
const Room = () => {
  const [messagesList, setMessagesList] = useState([]);
  const [messages, setMessages] = useState([])
  const [display, setDisplay] = useState("flex");
  const [displayA, setDisplayA] = useState("none")
  const [userId, setUserId] = useState("")
  const id = JSON.stringify(localStorage.getItem('id'));
  const ids = JSON.parse(id)
  const [inputIndex, setInputIndex] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3001/user/msg/${ids}`)
      .then(result => result.json())
      .then(json => {
        console.log(json, "Message Result")
        setMessagesList(json.usersMsg)
      })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3001/msg/${ids}/${userId}`)
      .then(result => result.json())
      .then(json => {
        setMessages([json]);
      })

  }, [])



  return (
    <div className='room-main-div'>
      {
        messagesList.map((user, index) => {
          return (
            <>
              <div className='user-msg-div' style={{ display: display }} onClick={() => {
                setDisplay("none")
                setDisplayA("flex")
                setUserId(user._id)
                setInputIndex(inputIndex => inputIndex === index ? null : index)
              }}>
                <div className='user-msg-div-firstChild'>
                  <img src={user.image} alt="" className='user-msg-image' />
                  <div className='user-msg-name-container'>
                    <span className='msg-user-span'>{user.name}</span>
                    <span className='msg-username-span'>@{user.username}</span>
                  </div>
                </div>
                <div className='user-msg-div-secondChild'>
                  <span><TfiMore className='more-icon' /></span>
                </div>
              </div>
              {inputIndex === index && <div className="user-msg-content" style={{ display: displayA }}>
                <div className='msg-content-header'>
                  <span className='back-icon-span'><IoIosArrowBack className='back-icon' /></span>
                  <img src={user.image} alt="" className='user-msg-sm-image' />
                  <div className='user-msg-name-container'>
                    <span className='user-msg-sm-name'>{user.name}</span>
                    <span className='msg-username-span'>@{user.username}</span>
                  </div>
                </div>
                <div className='message-content'>

                </div>
                <div className='content-send-msg-div'>
                    <input type="text" className='msg-text-input'/>
                    <IoIosMic className='mic-icon'/>
                    <BsImage className='image-icon'/>
                    <IoSend className='send-msg-icon'/>
                </div>
              </div>}
            </>
          )
        })
      }
    </div>
  )
}

export default Room