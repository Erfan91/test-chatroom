import React, { useEffect, useState } from 'react'
import img from "../images/téléchargement.jpeg"
import { useParams, Params } from 'react-router-dom'
const Profile = () => {
  const params = useParams();
  const [user, setUser] = useState([]);
  const [userAbout,setAbout] = useState('')
  const [users, setUsers] = useState([])
  useEffect(()=>{
    fetch("http://localhost:3001/user/" + params.username)
    .then(result=>result.json())
    .then(json=>{
      console.log(json, "JSON")
      setUser([json])
    })
  },[])

  const getUser = () =>{
    fetch("http://localhost:3001/user/" + params.username)
    .then(result=>result.json())
    .then(json=>{
      console.log(json, "JSON")
      setUser([json])
    })
  }
  const bioSender = e =>{
    e.preventDefault()
    fetch("http://localhost:3001/user/about",{
      method: "PUT",
      headers: new Headers({"content-type":"application/json"}),
      body: JSON.stringify({
        username: params.username,
        about: userAbout
      })
    }).then(result=>result.json())
    .then(json=>{
      console.log(json)
    })
    getUser()
  }

  const bioChanger = e =>{
    e.preventDefault()
    setAbout(e.target.value)
  }

  useEffect(()=>{
    fetch("http://localhost:3001/user")
    .then(result=>result.json())
    .then(json=>{
      console.log(json, 'JSON USers')
      setUsers(json)
    })
  },[])
  return (
    <div className='profile-main-div'>
        <div className='profile-info-div'>
            <div className='user-info-div'>
                <img src={img} className='profile-image'/>
                {user.map(user=>{
                  return(
                    <>
                    <span>{user.name}</span>
                   {!user.about ? 
                   <div className='user-about-div'>
                    <span>Tell us about your self</span>
                    <textarea cols={6} rows={6} onChange={bioChanger}/>
                    <button onClick={bioSender}>Submit</button>
                    </div>: <span>{user.about}</span> }
                    </>

                  )
                })

                }
            </div>
            <div className="user-avatar-div">

            </div>
        </div>
        <div className="find-users-div">
                {
                  users.map(user=>{
                    console.log(user)
                    return(
                      <>
                     {user.username == params.username ?<span style={{display: 'none'}}></span> :<div><span>{user.name}</span> <p>@{user.username}</p></div>}
                      </>
                    )
                  })
                }
        </div>
    </div>
  )
}

export default Profile