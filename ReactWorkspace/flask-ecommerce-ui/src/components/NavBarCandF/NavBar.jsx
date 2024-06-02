import { Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <Navbar bg="pink" variant="light" expand="lg" className="navbar navbar-margin">
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/" exact="true">HelloKitty Cafe</Nav.Link>
          <Nav.Link as={NavLink} to="/add-customer">Add Customer</Nav.Link>
          <Nav.Link as={NavLink} to="/customers">Customers</Nav.Link>
          <Nav.Link as={NavLink} to="/add-product">Add Product</Nav.Link>
          <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
          <Nav.Link as={NavLink} to="/place-order">Place Order</Nav.Link>
          <Nav.Link as={NavLink} to="/order-history">Order History</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
