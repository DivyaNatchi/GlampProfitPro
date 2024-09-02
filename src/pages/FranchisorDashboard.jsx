import { Outlet, Link } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

export default function FranchisorDashboard() {
  return (
    <>
      <Navbar color="light" light expand="lg">
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="commission-management">
              Commission management
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
      <p>Welcome to Franchisor Dashboard</p>
    </>
  );
}
