import { NavLink, Outlet } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

export default function FranchiseeDashboard() {
  return (
    <>
      <Navbar expand="lg">
        <Nav className="ml-auto" navbar>
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
      </Navbar>
      <Outlet />
    </>
  );
}
