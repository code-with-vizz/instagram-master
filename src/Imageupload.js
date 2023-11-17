import { useState } from "react";
import firebase from 'firebase';
import {Button} from '@material-ui/core'
import { db, storage } from "./firebase";
import './Imageupload.css'
const Imageupload=({userName})=>{
    const [caption,setCaption]=useState('')
    const [image,setImage] = useState(null)
   // const [url,setUrl] = useState("")
   const [progress,setProgress] = useState(0)
    const handleChange=(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }
    const handleupload=()=>{
        if(image!=null){
            const uploadTask = storage.ref(`images/${image.name}`).put(image)
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = Math.round(
                        (snapshot.bytesTransferred/snapshot.totalBytes)*100
                    )
                    setProgress(progress)
                },
                (error)=>{
                    console.log(error);
                    alert(error.message)
                },
                ()=>{
                    storage.ref("images").child(image.name).getDownloadURL().then(url=>{
                        db.collection("posts").add({
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            imageUrl:url,
                            userName:userName,
                        })
                        setProgress(0);
                        setCaption('')
                        setImage(null)
                    })
                }
            )
        }else{
            alert("Please select a file first")
        }

    }
    return(
        
        <div className="app__imageupload">
            <h1>{userName}</h1>
            <progress className="progressbar" value={progress} max="100"/>
            <input className="app_caption" type="text" value={caption} onChange={(e)=>setCaption(e.target.value)} placeholder="Enter a caption"/>
            <input className="file_select" type="file"  onChange={handleChange}/>
            <Button className="upload__button" onClick={handleupload}>
                Upload
            </Button>
        </div>
    )
}
export default Imageupload;