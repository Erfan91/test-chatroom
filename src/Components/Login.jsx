import React, { useState, } from 'react'
import {useNavigate, useNvaigate} from "react-router-dom";
const Login = () => {
    const [login, setLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const Navigate = useNavigate()

    const sender = e =>{
        e.preventDefault()
        fetch('http://localhost:3001/user/signup',{
            method: "POST",
            headers: new Headers({"content-type":"application/json"}),
            body: JSON.stringify({
                name:name,
                username:username,
                email:email
            })
        }).then(result=>result.json())
        .then(json=>{
            console.log(json, "user received")
        })
    }

    const connect = e =>{
        e.preventDefault()
        fetch('http://localhost:3001/user/login',{
            method: "POST",
            headers: new Headers({"content-type":"application/json"}),
            body: JSON.stringify({
                email: email,
                username: username
            })
        }).then(result=>result.json())
        .then(json=>{
            console.log(json)
            if(json.email == false){
                alert(json.email)
                
            }
            if(json.exists){
                Navigate('/room')
            }else{
                alert("Incorrect username")
            }
        })
    }
    const loginMode = () =>{
        setLogin(true)
    }
    const signupMode = () =>{
        setLogin(false)
    }

    const nameChanger = e =>{
        e.preventDefault()
        setName(e.target.value)
    }
    const userNameChanger = e =>{
        e.preventDefault()
        setUsername(e.target.value)
    }
    const emailChanger = e =>{
        e.preventDefault()
        setEmail(e.target.value)
    }
    return (
        <div className='login-main-div'>
            <div className='login-form-main-div'>
                <span>Connect to your account</span>
                <div className='form-input-container'>
                   {login? <span style={{display: "none"}}></span> : <div>
                        <span>Name*</span>
                        <input type="text" placeholder='Enter your name' onChange={nameChanger}/>
                    </div>}
                    <div>
                        <span>Email*</span>
                        <input type="text" placeholder='Enter your email' onChange={emailChanger}/>
                    </div>
                    <div>
                        <span>Username*</span>
                        <input type="text" placeholder='Enter username' onChange={userNameChanger}/>
                    </div>
                </div>
               {login? <button onClick={connect}>Login</button>:<button onClick={sender}>Submit</button>}
             {login ? <span onClick={signupMode} className='crt-acc-span'>Create account</span> : <span onClick={loginMode}>Login to your Account</span>}
            </div>
        </div>
    )
}

export default Login