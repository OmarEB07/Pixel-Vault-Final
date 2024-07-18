import React, { useState } from "react";
import { styled } from "styled-components";
import { Badge } from "@mui/material";
import {
  Search,
  ShoppingCartOutlined,
  LoginOutlined,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ImageLogo from "../Assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/userRedux";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { persistor } from "../Redux/store"; // adjust the import path according to your file structure
import { cartActions } from "../Redux/cartRedux";

const StyledLink = styled(RouterLink)`
  text-decoration: none;
  color: white;
  &:hover,
  &:focus {
    text-decoration: none;
    color: white;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  background-color: #32496f;
  font-size: 20px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  max-height: ${(props) => (props.isOpen ? "200px" : "0")};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
`;

const DropdownItem = styled.div`
  color: white;
  padding: 12px 10px;
  min-width: 100px;
  text-decoration: none;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #1b273c;
  }
`;

const Account = styled.div`
  margin-left: 25px;
  font-size: 25px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #1312c5;
    transition: background-color 0.3s ease-in-out;
  }
  &:hover ${DropdownContent} {
    display: block;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 15px;
  }
`;

const MenuItem = styled.div`
  margin-left: 25px;
  font-size: 25px;
  cursor: pointer;
  &:hover {
    background-color: #1312c5;
    transition: background-color 0.6s ease-in-out;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 15px;
  }
`;

const Logo = styled.div`
  & > img {
    object-fit: contain;
    max-width: 150px;
    position: relative;
    z-index: 11;
  }
`;

const SearchContainer = styled.div`
  margin-left: 25px;
  display: flex;
  align-items: center;
  padding: 5px;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: center;
    padding: 10px 0;
  }
`;

const Container = styled.div`
  background-color: #0b0b45;
  color: white;
  position: relative;
  z-index: 10;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Center = styled.div`
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Right = styled.div`
  justify-content: flex-end;
  flex: 1;
  display: flex;
  align-items: center;

  &:link {
    outline: none;
    text-decoration: none;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const StyledInput = styled.input`
  padding: 10px;
  margin: 5px;
  background-color: #48487f;
  border: 1px solid #48487f;
  border-radius: 5px;
  transition: border-color 0.3s;
  transition: background-color 0.4s;
  color: white;

  &:focus {
    border-color: white;
    outline: none;
    background-color: white;
    color: black;
  }

  &::placeholder {
    color: white;
  }
`;

const MobileMenuIcon = styled.div`
  display: none;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const MobileMenu = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${(props) => (props.isOpen ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    background-color: #0b0b45;
    position: absolute;
    top: 60px;
    left: 0;
    width: 100%;
    padding: 20px 0;
    animation: slide-down 0.3s ease-in-out;
  }

  @keyframes slide-down {
    from {
      transform: translateY(-20%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const quantity = useSelector((state) => state.cart?.quantity || 0);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate(); // Use useNavigate hook

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission default behavior
    if (searchInput.trim()) {
      navigate(`/search/${searchInput.trim()}`); // Navigate to the search page
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(cartActions.clearCart());

    persistor.purge().then(() => {
      console.log("Purged persist store");
    });
    navigate("/"); // Redirect to login page
  };

  return (
    <Container>
      <Wrapper>
        <Left>
          <StyledLink to="/">
            <Logo>
              <img src={ImageLogo} alt="Logo" />
            </Logo>
          </StyledLink>
        </Left>

        <Center></Center>

        <Right>
          <SearchContainer as="form" onSubmit={handleSearch}>
            <Search />
            <StyledInput
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </SearchContainer>
          <Account
            onMouseEnter={() => setIsAccountOpen(true)}
            onMouseLeave={() => setIsAccountOpen(false)}
          >
            <AccountCircleIcon style={{ marginRight: "5px" }} />
            Account
            <DropdownContent isOpen={isAccountOpen}>
              {currentUser ? (
                <>
                  <DropdownItem onClick={handleLogout}>
                    <LoginOutlined style={{ marginRight: "5px" }} />
                    Sign Out
                  </DropdownItem>
                </>
              ) : (
                <>
                  <DropdownItem>
                    <LoginOutlined style={{ marginRight: "5px" }} />
                    <StyledLink to="/login">Sign In</StyledLink>
                  </DropdownItem>
                  <DropdownItem>
                    <PersonAddAltRoundedIcon style={{ marginRight: "5px" }} />
                    <StyledLink to="/register">Sign Up</StyledLink>
                  </DropdownItem>
                </>
              )}
            </DropdownContent>
          </Account>
          <StyledLink to="/cart">
            <MenuItem>
              <Badge badgeContent={quantity} color="primary">
                <ShoppingCartOutlined color="white" style={{ fontSize: 30 }} />
              </Badge>
            </MenuItem>
          </StyledLink>
        </Right>

        <MobileMenuIcon onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <CloseIcon style={{ fontSize: 30 }} />
          ) : (
            <MenuIcon style={{ fontSize: 30 }} />
          )}
        </MobileMenuIcon>
      </Wrapper>

      <MobileMenu isOpen={isMobileMenuOpen}>
        <SearchContainer as="form" onSubmit={handleSearch}>
          <Search />
          <StyledInput
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </SearchContainer>
        <Account onClick={() => setIsAccountOpen(!isAccountOpen)}>
          <AccountCircleIcon style={{ marginRight: "5px" }} />
          Account
          <DropdownContent isOpen={isAccountOpen}>
            {currentUser ? (
              <>
                <DropdownItem onClick={handleLogout}>
                  <LoginOutlined style={{ marginRight: "5px" }} />
                  Sign Out
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem>
                  <LoginOutlined style={{ marginRight: "5px" }} />
                  <StyledLink to="/login">Sign In</StyledLink>
                </DropdownItem>
                <DropdownItem>
                  <PersonAddAltRoundedIcon style={{ marginRight: "5px" }} />
                  <StyledLink to="/register">Sign Up</StyledLink>
                </DropdownItem>
              </>
            )}
          </DropdownContent>
        </Account>
        <StyledLink to="/cart">
          <MenuItem>
            <Badge badgeContent={quantity} color="primary">
              <ShoppingCartOutlined color="white" style={{ fontSize: 30 }} />
            </Badge>
          </MenuItem>
        </StyledLink>
        {/* Toggle Button */}
        <MenuItem onClick={() => setIsMobileMenuOpen(false)}>
          <CloseIcon style={{ fontSize: 30, color: "white" }} />
        </MenuItem>
      </MobileMenu>
    </Container>
  );
};

export default Navbar;
