import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import { useState, useEffect } from 'react'
import { db } from './firebase'
const Post=({postId,user,userName,caption,imageUrl})=>{
    const [comment,setComment] = useState([])
    const [postcomment,setPostcomment] = useState("");
    useEffect(()=>{
        let unscribe;
        if(postId){
            unscribe = db.collection('posts').doc(postId).collection('comments').onSnapshot((snapshot)=>{
                setComment(snapshot.docs.map((doc)=>doc.data()))
            })
        }
        return()=>{
            unscribe()
        }
    },[postId])

    const postcommenttoDatabase=(event)=>{
        event.preventDefault();
        if(user!=null){
            db.collection('posts').doc(postId).collection('comments').add({
                comment:postcomment,
                userName: user.displayName
            });
            setPostcomment("")
        }else{
            alert("Signup or Login to comment")
        }

    }
    return(    
    <div className="post">
        <div className="post__header">
            <Avatar className="post__avatar"  src="/Photos/1.png" alt="Nilay"/>
            <h3>{userName} </h3>
        </div>

        <img className="post_postimage" src={imageUrl} alt="" />
        <h4 className="post__username"><strong>{userName}</strong> {caption}</h4>

        <div className="post_comments">
            {
                comment.map((com)=>{
                    return(
                    <p>
                        <strong>{com.userName}</strong> {com.comment}
                    </p>
                    )
                })
            }
        </div>

        <form className="form_comment">
            <input placeholder="Enter a comment" type="text" value={postcomment} className="post__input" onChange={(e)=>setPostcomment(e.target.value)}/>

            <button disabled={!postcomment} onClick={postcommenttoDatabase} className="post__comment">Post</button>
        </form>
        
    </div>

    )
}
export default Post;