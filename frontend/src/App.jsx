import React from "react";
import Header from "./components/Header";

import { Route,  Routes } from "react-router-dom";
import Tutors from "./pages/Tutors";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import Session from "./pages/Session";
import MySession from "./pages/MySession";
import Verify from "./pages/Verify";
import Login from "./pages/Login";
import Home from "./pages/Home";

const App = () => {
  return (
    <main>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutor" element={<Tutors />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile/>} />
        <Route path="/my-sessions" element={<MySession />} />
        <Route path="/session" element={<Session />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
};

export default App;
