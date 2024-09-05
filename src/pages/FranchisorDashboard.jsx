import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

export default function FranchisorDashboard() {
  return (
    <>
      <Navbar expand="lg">
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="commission-management">
              Commission management
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="Expense-Category-management">
              Expense Category management
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
      <p>Welcome to Franchisor Dashboard</p>
    </>
  );
}
