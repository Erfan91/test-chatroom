import React, { useEffect, useState } from 'react'
import axios from "axios"
import img from "../images/téléchargement.jpeg"
import { useParams, Params } from 'react-router-dom'
const Profile = () => {
  const params = useParams();
  const [user, setUser] = useState([]);
  const [userAbout, setAbout] = useState('')
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch("http://localhost:3001/user/" + params.username)
      .then(result => result.json())
      .then(json => {
        console.log(json, "JSON")
        setUser([json])
      })
  }, [])

  const getUser = () => {
    fetch("http://localhost:3001/user/" + params.username)
      .then(result => result.json())
      .then(json => {
        console.log(json, "JSON")
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
        console.log(json)
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
        console.log(json, 'JSON USers')
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
    // sendImage()
    setDisplay('none')
  }
  const sendImage = async e =>{
     await fetch("http://localhost:3001/user/user_image",{
      method: "PUT",
      headers: new Headers({"content-type":"application/json"}),
      body: JSON.stringify({
        url: file
      })
    }).then(result=>result.json())
    .then(json=>{
      console.log(json)
    })
  }

  // useEffect(()=>{
  //   sendImage()
  // },[file])
  return (
    <div className='profile-main-div'>
      <div className='profile-info-div'>
        <div className='user-info-div'>
          <div className='upload-first-div'>
            <input type="file" accept='/image*' ref={imageUploader} onChange={imageChanger} style={{ display: 'none' }} />
            <div className='upload-second-div' onClick={() => {
              imageUploader.current.click()
              setDisplay('none')
            }}>
              <img ref={uploadedImage} className='uploaded-image' />
              <span className='upload-span' style={{ display: display }}>+</span>
            </div>
            <button onClick={uploadImage} className='upload-btn'>Upload</button>
          </div>
          {user.map(user => {
            return (
              <>
                <span className='user-about-span'>{user.name}</span>
                {!user.about ?
                  <div className='user-about-div'>
                    <span>Tell us about your self</span>
                    <textarea cols={6} rows={6} onChange={bioChanger} />
                    <button onClick={bioSender}>Submit</button>
                  </div> : <span className='user-about-span'>{user.about}</span>}
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
          users.map(user => {
            console.log(user)
            return (
              <>
                {user.username == params.username ? <span style={{ display: 'none' }}></span> : <div><span>{user.name}</span> <p>@{user.username}</p></div>}
              </>
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile