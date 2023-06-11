import React, { useEffect, useState } from 'react'

const Room = () => {
  const [messages, setMessages] = useState([]);
  const id = JSON.stringify(localStorage.getItem('id'));
  const ids = JSON.parse(id)

  useEffect(()=>{
    fetch(`http://localhost:3001/user/msg/${ids}`)
    .then(result=>result.json())
    .then(json=>{
      console.log(json, "Message Result")
      setMessages(json.usersMsg)
    })
  },[])

  return (
    <div className='room-main-div'>
        {
          messages.map(user=>{
            return(
              <div className='user-msg-div'>
                <img src={user.image} alt="" className='user-msg-image' />
                <div className='user-msg-name-container'>
                <span className='msg-user-span'>{user.name}</span>
                <span className='msg-username-span'>@{user.username}</span>
                </div>
              </div>
            )
          })
        }
    </div>
  )
}

export default Room