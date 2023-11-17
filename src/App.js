import './App.css';
import Logo from './Photos/Logo.png';
import Post from './Post';
import {useState,useEffect} from 'react';
import { auth, db } from './firebase';
import Modal from '@material-ui/core/Modal';
import {Button,Input} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Imageupload from './Imageupload';



function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

function App() {
  const [posts,setPost] = useState([])
  const [open,setOpen] = useState(false)
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [email,setEmail] =useState('')
  const [password,setPassword] = useState('')
  const [userName,setUsername] = useState('')
  const [user,setUser]=useState(null)
  const [opensignin,setOpenSignIn]=useState(false)
  useEffect(()=>{
    const unsubscribe= auth.onAuthStateChanged((authuser)=>{
      if(authuser){
        setUser(authuser)
      }else{
        setUser(null)
      }
    })
    return ()=>{
      unsubscribe();
    }
  },[user,userName])

  const signin=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email,password).catch((error)=>alert(error.message));
    setOpenSignIn(false)
  }

  const handleLogin=(e)=>{
    e.preventDefault();
    setOpen(false);
    auth.createUserWithEmailAndPassword(email,password).then((authuser)=>{
      return authuser.user.updateProfile({
        displayName:userName
      })
    })
    .catch((error)=>alert(error.message));
    setOpen(false)
    setUsername('')
    setPassword('')
    setEmail('')
  }

  useEffect(() => {
    const unsubscribecol = db.collection('posts').onSnapshot(snapshot=>{
      setPost(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()
      }
      )))
    })
    return()=>{
      unsubscribecol();
    }
  }, [posts]);
  return (
    


    <div className="app">
      {user?.displayName?(<Imageupload userName={user.displayName}/>):(<h3>Login to upload image</h3>) }
      
        <Modal
          open={open}
          onClose={()=>setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_logo" alt="Alt text" src={Logo}/>
          </center>
          <form className="app_signup">
              <Input value={userName} type="text" onChange={(e)=>setUsername(e.target.value)} placeholder="Enter user name here"/>
              <Input value={email} type="text" onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email here"/>
              <Input value={password} placeholder="Enter password here" onChange={(e)=>setPassword(e.target.value)} type="password"/>
              <Button type="submit" onClick={handleLogin}>Login</Button>
          </form>

        </div>
      </Modal>


      <Modal
          open={opensignin}
          onClose={()=>setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="app_logo" alt="Alt text" src={Logo}/>
          </center>
          <form className="app_signup">
              <Input value={email} type="text" onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email here"/>
              <Input value={password} placeholder="Enter password here" onChange={(e)=>setPassword(e.target.value)} type="password"/>
              <Button type="submit" onClick={signin}>Login</Button>
          </form>

        </div>
      </Modal>

      <div className="app_header">
       <img className="app_logo" src={Logo} alt="Idk" />
      </div>
      {user?(
        <Button onClick={()=>auth.signOut()}>Sign Out</Button>
      ):(
        <div className="login_container">
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>

      )}
      
      {
        posts.map(({id,post})=>{
          return(
            <Post key={id} postId={id} user={user} userName={post.userName} caption={post.caption} imageUrl={post.imageUrl}/>
          )
        })
      }
    </div>
  );
}

export default App;
