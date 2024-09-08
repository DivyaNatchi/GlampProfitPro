import { Outlet, NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

export default function FranchisorDashboard() {
  return (
    <>
      <Navbar expand="lg">
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="commission-management"
            >
              Commission management
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="Expense-Category-management"
            >
              Expense Category management
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
      <p>Welcome to Franchisor Dashboard</p>
    </>
  );
}
