import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import Reactstrap components
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
} from "reactstrap";

// Importing Components
import Home from "./pages/Home";

export default function App() {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Router basename="/GlampProfitPro">
      <div>
        {/* Navigation Bar using Reactstrap */}
        <Navbar color="light" light expand="lg">
          <NavbarBrand tag={Link} to="/">
            GlampProfit Pro
          </NavbarBrand>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/calculate-rental-rate">
                  Calculate Rental Rate
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/expense-management">
                  Expense Management
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/profit-optimization">
                  Profit Optimization
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-link" to="/reports">
                  Reports
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        {/* Routing */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}
