import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Navbar from "./Components/Navbar.jsx";
import React from "react";
import AboutUsPage from "./Pages/AboutUs.jsx";
import ContactUs from "./Pages/ContactUs.jsx";
import Services from "./Pages/Services.jsx";
import Projects from "./Pages/Projects.jsx";
import AnnouncementPage from "./Pages/AnnouncementPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/news" element={<AnnouncementPage />} />
      </Routes>
    </>
  );
}

export default App;