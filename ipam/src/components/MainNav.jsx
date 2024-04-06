import React, { useState } from 'react';
import {
  Navbar,
  Container,
  Nav
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const MainNav = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const handleNavLinkClick = () => {
    setExpanded(false); 
  };
  return (
    <>
      <Navbar bg="light" expand="lg" className='main-nav'>
        <Container>
          <Navbar.Brand>Dmail</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="basic-navbar-nav" className={expanded ? 'show' : ''}>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/sign-in" 
              onClick={handleNavLinkClick} active={location.pathname === '/sign-in'}>Sign in</Nav.Link>
              <Nav.Link as={Link} to="/sign-up" 
              onClick={handleNavLinkClick} active={location.pathname === '/sign-up'}>Sign up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MainNav;