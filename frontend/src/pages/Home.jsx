import React from "react";
import Hero from "../components/Hero";
import FeatureTutor from "../components/FeatureTutor";
import Feature from "../components/Feature";
import Subjects from "../components/Subjects";
import About from "../components/About";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Feature />
      <Subjects />
      <FeatureTutor />
      <About/>
      <Footer/>
    </div>
  );
};

export default Home;
