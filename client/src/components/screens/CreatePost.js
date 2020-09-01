import React,{useState, useEffect} from 'react';
import M from "materialize-css"
import { useHistory } from 'react-router-dom';
const CreatePost = ()=>{
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [body,setBody] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(()=>{
        if(url){
            
        fetch("/createPost",{
            method:"post",
            headers:{"Content-Type":"application/json","Authorization":"Bearer "+localStorage.getItem("jwt")},
            body:JSON.stringify({
              title,
              body,
              pic:url
            })
          })
          .then(res=>res.json())
          .then(data=>{
            if(data.error){
              M.toast({html: data.error,classes:"#d50000 red accent-4"})
             } else {
              M.toast({html: "Post saved successfully !",classes:"#43a047 green darken-1"})
              history.push("/");
             }
          })
          .catch(err=>{
            console.log(err);
          })
        }
    },[url])

    const PostDetails = () => {
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
          <div className="card input-field" style={{maxWidth:"500px",margin:"50px auto",padding:"30px",textAlign:"center"}}>
            <input type="text" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)}></input>
            <input type="text" placeholder="Body" value={body} onChange={(e)=>setBody(e.target.value)}></input>
            <div className="file-field input-field" style={{display:"flex",justifyContent:"space-around",margin:"0 auto"}}>
                <div className="waves-effect waves-light btn sign-btn" style={{maxWidth:"40%",paddingBottom:"47px"}}>
                    <span>Upload Image</span>
                    <input type="file" multiple onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder="Upload one or more files" />
                </div>
            </div>
            <button
             className="waves-effect waves-light btn sign-btn"
              style={{maxWidth:"80%"}}
              onClick={()=>PostDetails()}
            >Submit</button>   
            </div>
          </div>
  );
}

export default CreatePost;