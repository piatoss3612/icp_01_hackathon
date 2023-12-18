import React, { useState, useEffect } from "react";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";


const Hero = () => {
  let navigate = useNavigate();

  const goExplore = () => {
    navigate("/explore");
  };
  const goCreate = () => {
    navigate("/create");
  };

  return (
    <div id="hero">
      <h1 id="header-text-first"> Canvas </h1>
      <h1 id="header-text-second"> Hold your own exhibition </h1>
      <h5 id="header-subtext">decentralized, on-chain, and open to everyone</h5>

      <div id="hero-buttons">
        <button id="explore" onClick={goExplore}>
          Explore
        </button>
        <button id="create" onClick={goCreate}>Create</button>
      </div>
    </div>
  );
};

export default Hero;
