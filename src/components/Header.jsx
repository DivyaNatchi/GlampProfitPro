import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav } from "reactstrap";
import "../styles/header.css";

export default function Header() {
  return (
    <>
      <Navbar className="sticky-nav" light expand="lg">
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
            Franchisee
          </NavLink>
          <NavLink
            to="/franchisor"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Franchisor
          </NavLink>
        </Nav>
      </Navbar>
    </>
  );
}
