import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, NavbarToggler, Collapse } from "reactstrap";
import "../styles/header.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Navbar light expand="md" className="custom-nav">
        <Link to="/" className="navbar-brand">
          GlampProfit Pro
        </Link>
        {/* Navbar Toggler placed correctly */}
        <NavbarToggler onClick={toggleNavbar} className="ml-auto" />
        {/* Collapse will handle the Nav links properly */}
        <Collapse isOpen={isOpen} navbar className="justify-content-end">
          <Nav navbar>
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
        </Collapse>
      </Navbar>
    </>
  );
}
