import React, { useEffect, useState } from 'react'

const Room = () => {
  const [messages, setMessages] = useState([]);
  const id = JSON.stringify(localStorage.getItem('id'));
  const ids = JSON.parse(id)

  useEffect(()=>{
    fetch(`http://localhost:3001/msg/${ids}`)
    .then(result=>result.json())
    .then(json=>{
      console.log(json, "json Message");
      setMessages([json])
    })
  },[])

  return (
    <div className='room-main-div'>
        <div></div>
    </div>
  )
}

export default Room