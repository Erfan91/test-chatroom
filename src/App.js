import React from "react";
import {Routes, Link, Route} from "react-router-dom"
import Login from "./Components/Login";
import Room from "./Components/Room";
import Profile from "./Components/Profile";
import "./styles/login.css"
import "./styles/profile.css";
import "./styles/room.css";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/room" element={<Room/>}/>
        <Route path="/profile/:username" element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
