import { Navbar } from "flowbite-react";

const Nav = ({active}: {active: string}) => {
  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Homer
        </span>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        <Navbar.Link href="/" active={active === "map"}>
          Map
        </Navbar.Link>
        <Navbar.Link href="/listing" active={active === "listings"}>
          Listings
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
