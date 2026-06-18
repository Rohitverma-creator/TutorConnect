import React from "react";
import Hero from "../components/Hero";
import Subjects from "../components/Subjects";
import About from "../components/About";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Home = () => {
  return (
    <div>
    <Header/>
      <Hero />
      <Subjects />
      <About/>
      <Footer/>
    
    </div>
  );
};

export default Home;
