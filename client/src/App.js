import React,{useEffect,createContext,useReducer, useContext} from 'react';
import { BrowserRouter,Route,useHistory,Switch } from 'react-router-dom';
import './App.css';
import NavbarC from './NavbarC.js';
import Home from './components/screens/Home.js';
import Profile from './components/screens/Profile.js';
import Signup from './components/screens/Signup.js';
import Signin from './components/screens/Signin.js';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts';
import {initialState,reducer} from "./reducers/userReducer"
import Draggable from "react-draggable"

export const UserContext = createContext()
const Routing = ()=>{
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    } else {
      history.push("/signin")
    }
  },[])

  return(
    <Switch>
      <Route exact path="/">
      <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
    </Switch>
  )
}


function App() {

  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
      <NavbarC />
      <Draggable bounds="html">
        <div style={{backgroundColor:"#56556e",color:"#f5f5f5",maxWidth: "max-content",fontSize:"20px",cursor:"pointer",position:"fixed",zIndex:"9999"}}>Made with <i className="material-icons" style={{color:"red"}}>favorite</i> by <strong>Shubham Aggarwal </strong></div>
      </Draggable>

      <Routing />
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
