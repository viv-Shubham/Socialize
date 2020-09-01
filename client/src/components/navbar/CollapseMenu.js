import React,{useContext} from 'react';
import styled from 'styled-components';
import {UserContext} from "../../App"
import {Link} from "react-router-dom"
import { useSpring, animated } from 'react-spring';

const CollapseMenu = (props) => {
    const {state,dispatch} = useContext(UserContext);
    const renderList = ()=>{
        if(state){
          return [
            <li key="8"><i  data-target="modal1" className="large material-icons modal-trigger" onClick={()=>{props.handleNavbar()}} style={{color:"white"}}>search</i></li>,
            <li key="1"><Link className="nav-items" onClick={()=>{props.handleNavbar()}} to="/myfollowingpost">My following Posts</Link></li>,
            <li key="2"><Link className="nav-items" onClick={()=>{props.handleNavbar()}} to="/profile">Profile</Link></li>,
            <li key="3"><Link className="nav-items" onClick={()=>{props.handleNavbar()}} to="/create">Create Post</Link></li>,
            <li key="4"><Link className="waves-effect waves-light btn sign-btn nav-items" style={{maxWidth:"120px"}} to="/signin" onClick={()=>{
              localStorage.clear();
              dispatch({type:"CLEAR"})
               props.handleNavbar()
            }}>Logout</Link></li>
          ]
        } else {
          return [
            <li key="5"><Link className="nav-items" onClick={()=>{props.handleNavbar()}} to="/signin">Sign in</Link></li>,
            <li key="6"><Link className="nav-items" onClick={()=>{props.handleNavbar()}} to="/signup">Sign up</Link></li>
          ]
        }
      }
  const { open } = useSpring({ open: props.navbarState ? 0 : 1 });

  if (props.navbarState === true) {
    return (
      <CollapseWrapper style={{
        position:"fixed",
        zIndex:"100",
          textAlign:"center",
        transform: open.interpolate({
          range: [0, 0.2, 0.3, 1],
          output: [0, -20, 0, -200],
        }).interpolate(openValue => `translate3d(0, ${openValue}px, 0`),
      }}
      >
        <NavLinks>
        <ul>{renderList()}</ul>

        </NavLinks>
      </CollapseWrapper>
    );
  }
  return null;
};

export default CollapseMenu;

const CollapseWrapper = styled(animated.div)`
  background: #2d3436;
  top: 4.5rem;
  left: 0;
  right: 0;
`;

const NavLinks = styled.ul`
  list-style-type: none;
  padding: 2rem 1rem 2rem 2rem;

  & li {
    transition: all 300ms linear 0s;
  }

  & li {
    font-size: 1.2rem;
    line-height: 2.3;
    color: #dfe6e9;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: #fdcb6e;
      border-bottom: 1px solid #fdcb6e;
    }
  }
`;