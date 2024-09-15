import { Outlet, NavLink } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";
import "../styles/dashboard.css";

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
              to="."
              end
            >
              Commission Management
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="expense-category-management"
            >
              Expense Category Management
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
    </>
  );
}
