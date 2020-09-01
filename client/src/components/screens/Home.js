import React,{useEffect,useState,useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from "react-router-dom"
import M from "materialize-css"
const Home = ()=>{
  const [data,setData] = useState([])
  const {state,dispatch} = useContext(UserContext)
  useEffect(()=>{
    let didCancel = false;

    fetch("/allPosts",{
      headers:{
        "Authorization":"Bearer "+localStorage.getItem("jwt")
    }})
    .then(res=>res.json())
    .then(result=>{
      if(!didCancel){
      setData(result.allPosts)
      }
    })
    return () => {
      didCancel = true;
    };
  })

  const likePost = (id)=>{
    fetch('/like',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
             //   console.log(result)
      const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
    }).catch(err=>{
        console.log(err)
    })
}
const unlikePost = (id)=>{
    fetch('/unlike',{
        method:"put",
        headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        },
        body:JSON.stringify({
            postId:id
        })
    }).then(res=>res.json())
    .then(result=>{
      //   console.log(result)
      const newData = data.map(item=>{
          if(item._id==result._id){
              return result
          }else{
              return item
          }
      })
      setData(newData)
    }).catch(err=>{
      console.log(err)
  })
}

const makeComment = (text,postId)=>{
  fetch("/comments",{
    method:"put",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+localStorage.getItem("jwt")
    },
    body:JSON.stringify({
      text,
      postId
    })
  })
  .then(res=>res.json())
  .then(result=>{
     //  console.log(result)
    const newData = data.map(item=>{
        if(item._id==result._id){
            return result
        }else{
            return item
        }
    })
    setData(newData)
  }).catch(err=>{
    console.log(err)
})
}

const deletePost = (postId) => {
  fetch(`/deletePost/${postId}`,{
  method:"delete",
  headers:{
    "Authorization":"Bearer "+localStorage.getItem("jwt")
  }
  }).then(res=>res.json())
  .then(result=>{
      // console.log(result)
      const newData = data.filter(item=>{
          return item._id !== result._id
      })
      setData(newData)
      if(result.error){
        M.toast({html: result.error,classes:"#c62828 red darken-3"})
      }
      else if(result.message) {
        M.toast({html:result.message,classes:"#43a047 green darken-1"})
      }
  })
}
    return (
      <div className="home">
        {data.map(item=>{
          return(
            <div className="card home-card" key={item._id}>
            <h5><Link to={item.postedBy._id == state._id?"/profile" : `/profile/${item.postedBy._id}`} style={{padding:"6px"}}>{item.postedBy.name}</Link> {item.postedBy._id == state._id && <i className="material-icons" style={{float:"right",padding:"6px"}} onClick={()=>{deletePost(item._id)}}>delete</i>}</h5>
            
            <div  className="card-image">
              <img alt="post-img" src={item.photo} />
            </div>
            <div className="card-content">

            {item.likes.includes(state._id)
            ? 
              <i className="material-icons" 
                    onClick={()=>{unlikePost(item._id)}}
              >thumb_down</i>
            : 
            <i className="material-icons" 
            onClick={()=>{likePost(item._id)}}
            >thumb_up</i>
            }
            
            
              <h6>{item.likes.length} likes</h6>
              <h6 style={{fontWeight:550}}>{item.title}</h6>
              <p>{item.body}</p>
              <h5>Comments :</h5>
              {
                item.comments.map(record=>{
                  return (
                    <h6 key={record._id}><span style={{fontWeight:550}}>{record.postedBy.name}:</span> {record.text}</h6>
                  )
                })
              }
              <form onSubmit={(e)=>{
                e.preventDefault()
                makeComment(e.target[0].value,item._id)
              }}>
              <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
          )
        })}
        
      </div>
    
  );
}

export default Home;