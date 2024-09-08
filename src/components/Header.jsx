import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from "react-router-dom";

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
          <NavLink
            to="/franchisee"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Franchisee Dashboard
          </NavLink>
          <NavLink
            to="/franchisor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Franchisor Dashboard
          </NavLink>
        </Nav>
      </Navbar>
    </div>
  );
}
