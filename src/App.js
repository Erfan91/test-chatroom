import React from "react";
import {Routes, Link, Route} from "react-router-dom"
import Login from "./Components/Login";
import Room from "./Components/Room";
import Profile from "./Components/Profile";
import "./styles/login.css"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/room" element={<Room/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
