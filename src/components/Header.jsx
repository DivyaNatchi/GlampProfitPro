import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// Importing Components
import Home from "../pages/Home";

// Import Reactstrap components
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
} from "reactstrap";

export default function Header() {
  return (
    <div>
      {/* Navigation Bar using Reactstrap */}
      <Navbar light expand="lg">
        <Link to="/" className="navbar-brand">
          GlampProfit Pro
        </Link>
        <Nav className="ml-auto" navbar>
          <Link to="/franchisee" className="nav-link">
            Franchisee Dashboard
          </Link>
          <Link to="/franchisor" className="nav-link">
            Franchisor Dashboard
          </Link>
        </Nav>
      </Navbar>
    </div>
  );
}
