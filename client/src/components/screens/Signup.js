import React,{useState, useEffect} from 'react';
import {Link,useHistory} from 'react-router-dom'
import M from "materialize-css";

const Signup = ()=>{

const history = useHistory()
const [name,setName] = useState("");
const [password,setPassword] = useState("");
const [email,setEmail] = useState("");
const [image,setImage] = useState("")
const [url,setUrl] = useState(undefined)
useEffect(()=>{
  if(url){
  uploadFields()
  }
},[url])
const PostData = () => {
    if(image){
      uploadPic()
    } else {
      uploadFields()
    }
}
const uploadFields=()=>{
  fetch("/signup",{
    method:"post",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      name:name,
      email:email,
      password:password,
      picUrl:url
    })
  })
  .then(res=>res.json())
    .then(data=>{
       if(data.error){
        M.toast({html: data.error,classes:"#d50000 red accent-4"})
       } else if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
        M.toast({html: 'Invalid email !',classes:"#d50000 red accent-4"})
        return
       } else {
        M.toast({html: data.message,classes:"#43a047 green darken-1"})
        history.push("/signin");
       }
    })
    .catch(err=>{
      console.log(err);
    })
}
const uploadPic = () => {
  const data = new FormData()
  data.append("file",image)
  data.append("upload_preset","insta-clone")
  data.append("cloud_name","viv-shubham")
  fetch("https://api.cloudinary.com/v1_1/viv-shubham/image/upload",{
      method:"post",
      body:data
  })
  .then(res=>res.json())
  .then(data=>{
      setUrl(data.url)
  })
  .catch(err=>{
      console.log(err);
  })

}

    return (
      <div className="fullpage">
        <div>
          <div className="card auth-card input-field">
            <img src="https://res.cloudinary.com/viv-shubham/image/upload/v1598915649/imp%20pics%20for%20Socialize%20project/download_1_dgrocz.png" alt="Socialize-logo" width="60" height="60" className="instagam-img" />
            <h3 className="instagram-logo">Socialize</h3>
            <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div className="file-field input-field" style={{display:"flex",justifyContent:"space-around",margin:"0 auto"}}>
                <div className="waves-effect waves-light btn sign-btn" style={{maxWidth:"40%",paddingBottom:"47px"}}>
                    <span>Upload Image</span>
                    <input type="file" multiple onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <button className="waves-effect waves-light btn sign-btn" onClick={()=>PostData()} >Sign up</button>
            <h6>Already have an Account? <Link to="/signin">Sign in</Link></h6>
          </div>
        </div>
      </div>
  );
}

export default Signup;