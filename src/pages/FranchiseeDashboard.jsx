import { Outlet, NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "../styles/dashboard.css";

export default function FranchiseeDashboard() {
  return (
    <>
      <Navbar>
        <Nav className="nav-row" navbar>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="."
              end
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
      </Navbar>
      <Outlet />
    </>
  );
}
