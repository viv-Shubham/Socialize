import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from "../../App"
import {useParams} from "react-router-dom"
import M from "materialize-css"
import '../../profileStyle.scss';
import VanillaTilt from "vanilla-tilt"
const Profile  = ()=>{
  const [userProfile,setProfile] = useState(null)
  
  const {state,dispatch} = useContext(UserContext)
  const {userid} = useParams()
  const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
  useEffect(()=>{
    let didCancel = false;
 
    // ...
    // you can check didCancel
    // before running any setState
    // ...
   

     fetch(`/user/${userid}`,{
         headers:{
             "Authorization":"Bearer "+localStorage.getItem("jwt")
         }
     }).then(res=>res.json())
     .then(result=>{
         //console.log(result)
          if(!didCancel){
          setProfile(result);
          }
     })
     return () => {
      didCancel = true;
    };
  },[])


  const followUser = ()=>{
      fetch('/follow',{
          method:"put",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem('jwt')
          },
          body:JSON.stringify({
              followId:userid
          })
      }).then(res=>res.json())
      .then(data=>{
      
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
           setProfile((prevState)=>{
               return {
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:[...prevState.user.followers,data._id]
                      }
               }
           })
           setShowFollow(false)
      })
  }
  const unfollowUser = ()=>{
      fetch('/unfollow',{
          method:"put",
          headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem('jwt')
          },
          body:JSON.stringify({
              unfollowId:userid
          })
      }).then(res=>res.json())
      .then(data=>{
          
          dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
           localStorage.setItem("user",JSON.stringify(data))
          
           setProfile((prevState)=>{
              const newFollower = prevState.user.followers.filter(item=>item != data._id )
               return {
                   ...prevState,
                   user:{
                       ...prevState.user,
                       followers:newFollower
                      }
               }
           })
           setShowFollow(true)
           
      })
  }
  return (
      <>
      {userProfile?
         <div className="fullpage" style={{maxWidth:"70%",margin:"0 auto"}}>
         <div className="profile-head" style={{margin:"50px auto"}}>
           <div className="wrapper">
           <div className="profile-card js-profile-card">
             <div className="profile-card__img">
               <img src={userProfile.user.picUrl} alt="profile card" />
             </div>
             <div className="profile-card__cnt js-profile-cnt">
               <div className="profile-card__name"><h4>{userProfile.user.name}</h4></div>
               <div className="profile-card__name"><h5>{userProfile.user.email}</h5></div>
               <div className="profile-card-inf">
               <div className="profile-card-inf__item">
                  <div className="profile-card-inf__title">{userProfile.user.followers.length}</div>
                  <div className="profile-card-inf__txt">Followers</div>
                </div>
          <div className="profile-stats">
                <div className="profile-card-inf__item">
                  <div className="profile-card-inf__title">{userProfile.user.following.length}</div>
                  <div className="profile-card-inf__txt">Following</div>
                </div>
                 <div className="profile-card-inf__item">
                   <div className="profile-card-inf__title">{userProfile.posts.length}</div>
                   <div className="profile-card-inf__txt">Posts</div>
                 </div>
               </div>
               </div>
                 {showfollow?
                 <button className="profile-card__button button--orange" onClick={()=>followUser()}>Follow</button>
                 :
                 <button className="profile-card__button button--orange" onClick={()=>unfollowUser()}>UnFollow</button>
                  }
               </div>
 
 
           </div>
           </div>
         </div>
 
             <div className="profile-gallery" >
               {
               userProfile.posts.map(pic=>{
                 return (
                   <div data-tilt data-tilt-scale="1.1" key={pic._id} className="ptbBx">
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
      :<h2>loading...</h2>
    }
     
      </>
  );
}

export default Profile;