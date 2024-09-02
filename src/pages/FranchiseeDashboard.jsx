import { Link, Outlet } from "react-router-dom";
import { Navbar, Nav, NavItem } from "reactstrap";

export default function FranchiseeDashboard() {
  return (
    <>
      <Navbar color="light" light expand="lg">
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Link className="nav-link" to="calculate-rental-rate">
              Calculate Rental Rate
            </Link>
          </NavItem>
          <NavItem>
            <Link className="nav-link" to="expense-management">
              Expense Management
            </Link>
          </NavItem>
        </Nav>
      </Navbar>
      <Outlet />
      <p>Welcome to Franchisee Dashboard</p>
    </>
  );
}
