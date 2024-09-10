import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import "../styles/dashboard.css";

export default function FranchiseeDashboard() {
  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <Nav navbar>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="calculate-rental-rate"
            >
              Calculate Rental Rate
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="expense-management"
            >
              Expense Management
            </NavLink>
          </NavItem>
        </Nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}
