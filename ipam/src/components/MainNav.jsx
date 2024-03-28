import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const MainNav = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();

  // Function to handle navbar link click
  const handleNavLinkClick = () => {
    setExpanded(false); // Close the navbar when a link is clicked
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className='main-nav'>
        <Container>
          <Navbar.Brand>Dmail</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav" className={expanded ? 'show' : ''}>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/sign-in" onClick={handleNavLinkClick} active={location.pathname === '/sign-in'}>Login</Nav.Link>
              <Nav.Link as={Link} to="/sign-up" onClick={handleNavLinkClick} active={location.pathname === '/sign-up'}>Sign up</Nav.Link>
              
              <NavDropdown title="Dropdown" id="basic-nav-dropdown" hidden>
                <NavDropdown.Item href="#">Action</NavDropdown.Item>
                <NavDropdown.Item href="#">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#">Something else</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled hidden>Disabled</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MainNav;