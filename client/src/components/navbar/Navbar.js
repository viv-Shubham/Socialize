import React,{useContext,useEffect,useState, useRef} from 'react';
import {Link, useHistory } from 'react-router-dom'
import "../../App.css";
import {UserContext} from "../../App"
import styled from "styled-components";
import { useSpring, animated, config } from "react-spring";
import BurgerMenu from "./BurgerMenu";
import CollapseMenu from "./CollapseMenu";


import M from 'materialize-css'
const Navbar = (props)=>{
  const {state,dispatch} = useContext(UserContext);
  const  searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const history = useHistory()
  useEffect(()=>{
      M.Modal.init(searchModal.current)
  },[])
  const renderList = ()=>{
    if(state){
      return [
        <li key="8"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"white"}}>search</i></li>,
        <li key="1"><Link className="nav-items" to="/myfollowingpost">My following Posts</Link></li>,
        <li key="2"><Link className="nav-items" to="/profile">Profile</Link></li>,
        <li key="3"><Link className="nav-items" to="/create">Create Post</Link></li>,
        <li key="4"><Link className="waves-effect waves-light btn sign-btn nav-items" to="/signin" onClick={()=>{
          localStorage.clear();
          dispatch({type:"CLEAR"})
        }}>Logout</Link></li>
      ]
    } else {
      return [
        <li key="5"><Link className="nav-items" to="/signin">Sign in</Link></li>,
        <li key="6"><Link className="nav-items" to="/signup">Sign up</Link></li>
      ]
    }
  }
  const fetchUsers = (query)=>{
     setSearch(query)
     fetch('/search-users',{
       method:"post",
       headers:{
         "Content-Type":"application/json"
       },
       body:JSON.stringify({
         query
       })
     }).then(res=>res.json())
     .then(results=>{
       setUserDetails(results.user)
     })
  }
//     return (
//       <div>
//       <div className="navbar-fixed">
//       <nav>
//         <div className="nav-wrapper">
//           <Link to={state?"/":"/signin"} className="brand-logo">Socialize</Link>
//           <ul id="nav-mobile" className="right hide-on-med-and-down">
//             {renderList()}
//           </ul>
//         </div>
//         <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
//           <div className="modal-content">
//           <input
//             type="text"
//             placeholder="search users"
//             value={search}
//             onChange={(e)=>fetchUsers(e.target.value)}
//             />
//              <ul className="collection">
//                {userDetails.map(item=>{
//                  return <Link key={item._id} to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
//                    M.Modal.getInstance(searchModal.current).close()
//                    setSearch('')
//                  }}><li className="collection-item">{item.name +"  ->  "+ item.email}</li></Link> 
//                })}
               
//               </ul>
//           </div>
//           <div className="modal-footer">
//             <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button>
//           </div>
//           </div>
//       </nav>
//       </div>
//       <input className="l" type="checkbox" />
//       </div>
//   );
// }
// export default NavBar;




  const barAnimation = useSpring({
    from: { transform: 'translate3d(0, -10rem, 0)' },
    transform: 'translate3d(0, 0, 0)',
  });

  const linkAnimation = useSpring({
    from: { transform: 'translate3d(0, 30px, 0)', opacity: 0 },
    to: { transform: 'translate3d(0, 0, 0)', opacity: 1 },
    delay: 800,
    config: config.wobbly,
  });

  return (
    <>
    <div style={{position:"relative",marginBottom:"100px"}}>
      <NavBar style={barAnimation}>
        <FlexContainer>
        <Link to={state?"/":"/signin"} className="brand-logo" >Socialize</Link>
          <NavLinks style={linkAnimation}>
            <ul>{renderList()}</ul>          
          </NavLinks>
          <BurgerWrapper>
            <BurgerMenu
              navbarState={props.navbarState} 
              handleNavbar={props.handleNavbar}
            />
          </BurgerWrapper>
        </FlexContainer>
        <div id="modal1" className="modal" ref={searchModal} style={{color:"black",minHeight:"max-content",maxHeight:"400px",minWidth:"400px",maxWidth:"400px",position:"absolute",zIndex:"99999"}}>
          <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e)=>fetchUsers(e.target.value)}
            />
             <ul className="collection">
               {userDetails.map(item=>{
                 return <Link key={item._id} to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setSearch('')
                 }}><li className="collection-item">{item.name +"  ->  "+ item.email}</li></Link> 
               })}
               
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')} style={{fontWeight:"600",fontSize:"2.1rem"}}>close</button>
          </div>
          </div>
      </NavBar>
      </div>
      <CollapseMenu 
        navbarState={props.navbarState} 
        handleNavbar={props.handleNavbar}
      />
   </>
  )
}

export default Navbar

const NavBar = styled(animated.nav)`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  background: #2d3436;
  z-index: 1;
  font-size: 1.4rem;
`;

const FlexContainer = styled.div`
  max-width: 120rem;
  display: flex;
  margin: auto;
  padding: 0 2rem;
  height: 5rem;
`;
const NavLinks = styled(animated.ul)`
  justify-self: end;
  list-style-type: none;
  margin: auto 0 auto auto;
  
  & li {
    font-size:1rem;
    color: #dfe6e9;
    text-transform: uppercase;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    margin: 0 0;
    transition: all 300ms linear 0s;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      color: #fdcb6e;
      border-bottom: 1px solid #fdcb6e;
    }

    @media (max-width: 993px) {
      display: none;
    }
  }
`;

const BurgerWrapper = styled.div`
  margin: auto 0;

  @media (min-width: 994px) {
    display: none;
  }
`;