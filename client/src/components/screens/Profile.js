import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from "../../App"
import M from "materialize-css"
import '../../profileStyle.scss';
import VanillaTilt from "vanilla-tilt"
const Profile = ()=>{
  const {state,dispatch} = useContext(UserContext)
  const [data,setData] = useState([])
  const [image,setImage] = useState("")
const [url,setUrl] = useState("")
  useEffect(()=>{
    let didCancel = false;
 
    // ...
    // you can check didCancel
    // before running any setState
    // ...
   
   
    fetch("/myPosts",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }})
    .then(res=>res.json())
    .then(result=>{
      if(!didCancel){
      setData(result.myPosts)
      }
    })
    return () => {
      didCancel = true;
    };
  })
  useEffect(()=>{
    if(image){
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

   
       fetch('/updatepic',{
           method:"put",
           headers:{
               "Content-Type":"application/json",
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           },
           body:JSON.stringify({
               picUrl:data.url
           })
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           localStorage.setItem("user",JSON.stringify({...state,picUrl:result.picUrl}))
           dispatch({type:"UPDATEPIC",payload:result.picUrl})
           //window.location.reload()
       })
   
    })
    .catch(err=>{
        console.log(err)
    })
   }
},[image])
  return (
      <div className="fullpage" style={{maxWidth:"70%",margin:"0 auto"}}>
        <div className="profile-head" style={{margin:"50px auto"}}>
          
          <div className="wrapper">
          <div className="profile-card js-profile-card">
            <div className="profile-card__img">
              <img src={state?state.picUrl:"Loading"} alt="profile card" />
            </div>
            <div className="profile-card__cnt js-profile-cnt">
              <div className="profile-card__name">{state?state.name:"Loading"}</div>
              <div className="profile-card-inf">
                <div className="profile-card-inf__item">
                  <div className="profile-card-inf__title">{state?state.followers.length:"0"}</div>
                  <div className="profile-card-inf__txt">Followers</div>
                </div>
          <div className="profile-stats">
                <div className="profile-card-inf__item">
                  <div className="profile-card-inf__title">{state?state.following.length:"0"}</div>
                  <div className="profile-card-inf__txt">Following</div>
                </div>
                <div className="profile-card-inf__item">
                  <div className="profile-card-inf__title">{data.length}</div>
                  <div className="profile-card-inf__txt">Posts</div>
                </div>
              </div>
              </div>
              <div className="file-field input-field" style={{display:"flex",margin:"40px 25% 0"}}>
                <div className="waves-effect waves-light btn sign-btn" style={{maxWidth:"40%",paddingBottom:"47px"}}>
                    <span>Upload Image</span>
                    <input type="file" multiple onChange={(e)=>{setImage(e.target.files[0])}} />
                </div>
                <div className="file-path-wrapper" style={{maxWidth:"50%"}}>
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
              </div>


          </div>
          </div>
        </div>

            <div className="profile-gallery" >
              {
              data.map(pic=>{
                return (
                  <div key={pic._id} data-tilt data-tilt-scale="1.1" className="ptbBx">
                    <img className="profile-item" src={pic.photo} alt={pic.title} />
                    <div className="contentBx #eceff1 blue-grey lighten-5">
                      <p>{pic.title}</p>
                      <h6>{pic.body}</h6>
                    </div>
                    {
                    VanillaTilt.init(document.querySelectorAll(".ptbBx"), {
                    max: 25,
                    speed: 400
                  })
                  }
                  </div>
                  
              )})
              }
            </div>
      </div>
      
  );
}

export default Profile;