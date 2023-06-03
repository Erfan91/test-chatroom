import React, { useEffect, useState } from 'react'
import axios from "axios"
import img from "../images/téléchargement.jpeg"
import { useParams, Params } from 'react-router-dom'

const Profile = () => {
  const params = useParams();
  const [user, setUser] = useState([]);
  const [userAbout, setAbout] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("user's name");
  const [btnDisplay, setBtnDisplay] = useState('none');
  const [divDisplay, setDivDisplay] = useState('none')
  const [submit, setSubmit] = useState(null)
  //  upName created cause to avoid runtime error for upper case in case when it (name state) is used inline
  const upName = name

  useEffect(() => {
    fetch("http://localhost:3001/user/" + params.username)
      .then(result => result.json())
      .then(json => {
        console.log(json, "JSON")
        setUser([json])
        setName(json.name)
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
        console.log(json)
      })
    getUser()
  }

  // useEffect(()=>{
  //   sendImage()
  // },[file])
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
                    <img src={user.image} className='uploaded-image' />
                    <span className='user-name-span'>{user.name}</span>
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
                {user.username == params.username ? <span style={{ display: 'none' }}></span> :
                  <div className='add-user-div'>
                    <img src={user.image} className='add-user-image' />
                    <span>{user.name}</span>
                    <p>@{user.username}</p>
                  </div>
                }
              </>
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile