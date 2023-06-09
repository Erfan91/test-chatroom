import React, { useEffect, useState } from 'react';
import { TfiMore } from "react-icons/tfi";
import { IoIosArrowBack, IoIosMic } from "react-icons/io";
import { BsImage } from "react-icons/bs"
import { IoSend } from "react-icons/io5";
import moment from "moment";
const Room = (props) => {
  const [messagesList, setMessagesList] = useState([]);
  const [messages, setMessages] = useState([])
  const [display, setDisplay] = useState("flex");
  const [displayA, setDisplayA] = useState("none")
  const [userId, setUserId] = useState("")
  const id = JSON.stringify(localStorage.getItem('id'));
  const ids = JSON.parse(id)
  const [inputIndex, setInputIndex] = useState(null);
  const [inputTxt, setInputTxt] = useState('');
  const [messageId, setMessageId] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/user/msg/${ids}`)
      .then(result => result.json())
      .then(json => {
        console.log(json, "Message Result")
        setMessagesList(json.usersMsg)
        // if(json.usersMsg[0].sender._id == ids){
        //   setMessagesList([json.usersMsg[0].receiver])
        // }else if(json.usersMsg[0].receiver._id == ids){
        //   setMessagesList([json.usersMsg[0].sender])
        // }
      })
  }, [])

  useEffect(() => {
    fetch(`http://localhost:3001/msg/${ids}/${userId}`)
      .then(result => result.json())
      .then(json => {
        setMessages(json);
      })

  }, [userId])

  useEffect(() => {
    setMessagesList(props.propsMsg)
  }, [props.propsMsg])

  const refresher = () => {
    fetch(`http://localhost:3001/msg/${ids}/${userId}`)
      .then(result => result.json())
      .then(json => {
        setMessages(json);
      })
  }
  const textChanger = e => {
    e.preventDefault()
    setInputTxt(e.target.value)
  }

  const messageSender = async e => {
    e.preventDefault()
    await fetch('http://localhost:3001/msg', {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({
        sender: ids,
        receiver: userId,
        content: inputTxt
      })
    }).then(result => result.json())
      .then(json => {
        // console.log(json)

      })
    refresher()
  }

  const changeSeen = (id) =>{
    fetch('http://localhost:3001/userMsg',{
      method: "PUT",
      headers: new Headers({"content-type":"application/json"}),
      body: JSON.stringify({
        id: id,
        ids: ids
      })
    }).then(result=>result.json())
    .then(json=>{
      console.log(json, "seen updated")
    })
  }

  return (
    <div className='room-main-div' style={{ display: props.display }}>
      {
        messagesList.map((user, index) => {
          return (
            <>
              {user.sender._id == ids && user.seen?
                <div className='user-msg-div-seen' style={{ display: display }} onClick={async () => {
                setDisplay("none")
                setDisplayA("flex")
                await setUserId(user.receiver._id)
                console.log(user.receiver._id, "USER ID")
                setInputIndex(inputIndex => inputIndex === index ? null : index)
                changeSeen(user._id)
              }}>
                <div className='user-msg-div-firstChild'>
                  <img src={user.receiver.image} alt="" className='user-msg-image' />
                  <div className='user-msg-name-container'>
                    <span className='msg-user-span'>{user.receiver.name}</span>
                    <span className='msg-username-span'>@{user.receiver.username}</span>
                  </div>
                </div>
                <div className='user-msg-div-secondChild'>
                  <span><TfiMore className='more-icon' /></span>
                </div>
              </div>
              :user.sender.id == ids && !user.seen?
              <div className='user-msg-div' style={{ display: display }} onClick={async () => {
                setDisplay("none")
                setDisplayA("flex")
                await setUserId(user.receiver._id)
                console.log(user.receiver._id, "USER ID")
                setInputIndex(inputIndex => inputIndex === index ? null : index)
                changeSeen(user._id)
              }}>
                <div className='user-msg-div-firstChild'>
                  <img src={user.receiver.image} alt="" className='user-msg-image' />
                  <div className='user-msg-name-container'>
                    <span className='msg-user-span'>{user.receiver.name}</span>
                    <span className='msg-username-span'>@{user.receiver.username}</span>
                  </div>
                </div>
                <div className='user-msg-div-secondChild'>
                  <span><TfiMore className='more-icon' /></span>
                </div>
              </div>
              :user.receiver._id == ids && user.seen?
              <div className='user-msg-div-seen' style={{ display: display }} onClick={async () => {
                setDisplay("none")
                setDisplayA("flex")
                await setUserId(user.sender._id)
                console.log(user.sender._id, "USER ID")
                setInputIndex(inputIndex => inputIndex === index ? null : index)
                changeSeen(user._id)
              }}>
                <div className='user-msg-div-firstChild'>
                  <img src={user.sender.image} alt="" className='user-msg-image' />
                  <div className='user-msg-name-container'>
                    <span className='msg-user-span'>{user.sender.name}</span>
                    <span className='msg-username-span'>@{user.sender.username}</span>
                  </div>
                </div>
                <div className='user-msg-div-secondChild'>
                  <span><TfiMore className='more-icon' /></span>
                </div>
              </div>: user.receiver._id == ids && !user.seen?
              <div className='user-msg-div' style={{ display: display }} onClick={async () => {
                setDisplay("none")
                setDisplayA("flex")
                await setUserId(user.receiver._id)
                console.log(user.receiver._id, "USER ID")
                setInputIndex(inputIndex => inputIndex === index ? null : index)
                changeSeen(user._id)
              }}>
                <div className='user-msg-div-firstChild'>
                  <img src={user.receiver.image} alt="" className='user-msg-image' />
                  <div className='user-msg-name-container'>
                    <span className='msg-user-span'>{user.receiver.name}</span>
                    <span className='msg-username-span'>@{user.receiver.username}</span>
                  </div>
                </div>
                <div className='user-msg-div-secondChild'>
                  <span><TfiMore className='more-icon' /></span>
                </div>
              </div>:console.log("unknown error")
              }
              {inputIndex === index && <div className="user-msg-content" style={{ display: displayA }}>
                <div className='msg-content-header'>
                  <span className='back-icon-span'><IoIosArrowBack className='back-icon' onClick={() => {
                    setDisplay('flex');
                    setDisplayA("none")
                  }} /></span>
                  <img src={user.image} alt="" className='user-msg-sm-image' />
                  <div className='user-msg-name-container'>
                    <span className='user-msg-sm-name'>{user.name}</span>
                    <span className='msg-username-span'>@{user.username}</span>
                  </div>
                </div>
                <div className='message-content'>
                  {messages.map(msg => {
                    return (
                      <>
                        {msg.sender._id == ids ? <div className='current-user-msg'>
                          <div className='msg-time-div'>
                            <span className='msg-time-span'>{moment(msg.createdAt).format("h:mm a")}</span>
                            <span className='current-user-text-span'>{msg.content}</span>
                          </div>
                          <img src={msg.sender.image} alt="" className='msg-sender-sm-image' />
                        </div>
                          :
                          <div className='user2-user-msg'>
                            <img src={msg.sender.image} alt="" className='msg-sender-sm-image' />
                            <div className='msg-time-div'>
                              <span className='user2-user-text-span'>{msg.content}</span>
                              <span className='msg-time-span'>{moment(msg.createdAt).format("h:mm a")}</span>
                            </div>
                          </div>
                        }
                      </>
                    )
                  })}
                </div>
                <div className='content-send-msg-div'>
                  <input type="text" className='msg-text-input' onChange={textChanger} />
                  <IoIosMic className='mic-icon' />
                  <BsImage className='image-icon' />
                  <IoSend className='send-msg-icon' onClick={messageSender} />
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