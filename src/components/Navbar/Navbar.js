import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import './Navbar.css'

window.addEventListener('scroll', function() {
    var navbar = document.querySelector('.navbar');
    if (window.scrolly > 1000) { // Adjust 100 to your desired scroll position
      navbar.style.position = 'relative'; // or 'absolute', depending on your layout
      navbar.style.top = '100px'; // Adjust the distance from the top as needed
    } else {
      navbar.style.position = 'fixed';
      navbar.style.top = '0';
    }
  });


  export default function Navs() {
    const [expanded, setExpanded] = useState(false);

    // Function to handle nav item clicks and check for mobile state
    const handleNavItemClick = () => {
      // Optional: Check for mobile state using a media query or screen size
      if (window.innerWidth <= 768) { // Adjust the breakpoint as needed
        setExpanded(false); // Close the navbar on mobile
      }
    };
    
    return (
        <Navbar bg="dark" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
            <Container>
                <Navbar.Brand href="#home">TrustIsMust</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" onSelect={handleNavItemClick}>
                    <Nav.Link href="#home">Home</Nav.Link>
                    {/* <Nav.Link href="#services">Services</Nav.Link> */}
                    <Nav.Link href="#features">Features</Nav.Link>
                    <Nav.Link href="#compare">Compare</Nav.Link>
                    <Nav.Link href="#members">Team</Nav.Link>
                    <Nav.Link href="#questions">Questions</Nav.Link>
                    <Nav.Link id="contactt" href="#contact">Contact</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
