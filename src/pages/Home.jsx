import React from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";
import "../styles/homePage.css";

export default function Home() {
  return (
    <Container fluid className="hero-section ">
      <div className="hero-container">
        <h1>Welcome to GlampProfit Pro</h1>
        <p className="hero-subtitle animate__animated animate__fadeInUp animate__delay-1s">
          This application helps you optimize rental rates, manage expenses, and
          maximize profits for your glamping business.
        </p>
        <p>Select your dashboard to begin</p>
        <div className="cta-buttons">
          <Link to="/franchisee" size="lg">
            Go to Franchisee
          </Link>
          <Link to="/franchisor" size="lg">
            Go to Franchisor
          </Link>
        </div>
      </div>
    </Container>
  );
}
