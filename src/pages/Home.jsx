import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5">
      <h1>Welcome to GlampProfit Pro</h1>
      <p>
        This application helps you optimize rental rates, manage expenses, and
        maximize profits for your glamping business.
      </p>
      <p>Select your dashboard to begin</p>
      <Link to="/franchisee" className="btn btn-primary">
        Go to Franchisee Dashboard
      </Link>
      <Link
        to="/franchisor"
        className="btn btn-secondary"
        style={{ marginLeft: "10px" }}
      >
        Go to Franchisor Dashboard
      </Link>
    </div>
  );
}
