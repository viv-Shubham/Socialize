import React,{useState,useContext} from 'react';
import {Link, useHistory} from 'react-router-dom'
import M from "materialize-css"
import {UserContext} from "../../App"

const Signin = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const history = useHistory()
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const PostData = ()=>{
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
        return
    }
    fetch("/signin",{
        method:"post",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            password,
            email
        })
    }).then(res=>res.json())
    .then(data=>{
       if(data.error){
          M.toast({html: data.error,classes:"#c62828 red darken-3"})
       }
       else{
           localStorage.setItem("jwt",data.token)
           localStorage.setItem("user",JSON.stringify(data.user))
           dispatch({type:"USER",payload:data.user})
           M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
           history.push('/')
       }
    }).catch(err=>{
        console.log(err)
    })
}
    return (
      <div className="fullpage">
        <div>
          <div className="card auth-card input-field">
            <img src="https://res.cloudinary.com/viv-shubham/image/upload/v1598915649/imp%20pics%20for%20Socialize%20project/download_1_dgrocz.png" alt="Socialize-logo" width="60" height="60" className="instagam-img" />
            <h3 className="instagram-logo">Socialize</h3>
            <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} ></input>
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} ></input>
            <button className="waves-effect waves-light btn sign-btn" onClick={()=>PostData()} >Sign in</button>
            <h6>Don't have an Account? <Link to="/signup">Sign up</Link></h6>            
          </div>
        </div>
      </div>
  );
}

export default Signin;