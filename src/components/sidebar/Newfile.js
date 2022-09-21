import React, {useState} from 'react'
import AddIcon from '@material-ui/icons/Add';
// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File, Blob } from 'nft.storage'
// The 'mime' npm package helps us set the correct file type on our File objects
import mime from 'mime'
import path from 'path'
import fs from 'fs'
import '../../styles/NewFile.css';
import {db, auth} from '../../firebase';
import firebase from 'firebase/compat/app';
import { doc, setDoc, addDoc, collection} from "firebase/firestore"
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import axios from 'axios';

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBkQjQ3NjRFNDk1YkNFNzZFNDlERjM0QUQzNWZDOEZmZEViY0MzNzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjYxNjc3NTk4MCwibmFtZSI6IlJ1bXVDIn0.LZ74hko8tEU5W3BqFIkWmWBcLk_P4SJJ7HadOAlHTOI'

function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  }
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px soldid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3),
  }
}))

async function fileFromPath(filePath) {
  const content = await fs.promises.readFile(filePath)
  const type = mime.getType(filePath)
  return new File([content], path.basename(filePath), { type })
}

const Newfile = () => {

  const classes = useStyles();

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
        
      console.log(e.target.files[0].name);
      console.log(file)
    }
  }


  const handleUpload = async () => {
    setUploading(true)

    /* const config = {
      headers: {
        Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBkQjQ3NjRFNDk1YkNFNzZFNDlERjM0QUQzNWZDOEZmZEViY0MzNzkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MjYxNjc3NTk4MCwibmFtZSI6IlJ1bXVDIn0.LZ74hko8tEU5W3BqFIkWmWBcLk_P4SJJ7HadOAlHTOI',
        "Content-Type": "application/car",
      },
    };
    axios
      .post("https://api.nft.storage/upload", file, {
        headers: {
          Authorization: NFT_STORAGE_KEY,
          'Content-Type': "application/car",
        },
      })
      .then((res) => {
        console.log(res.locals.user);
        console.log(res)
        setUploading(false)
        setOpen(false)
        setFile(null)

      })
      .catch((err) => console.log(err)); */

      
    const type = mime.getType(file.name)
    
    const dbRef = collection(db, "myFiles");


    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    

    /* // call client.store, passing in the image & metadata
    return nftstorage.store({
      image: new File([fs.promises.readFile(file)], file.name, { type }),
      name: '12312dsdgddd3',
      description: 'test',
    }).then(result => {
      console.log(result)
      setUploading(false)
      setOpen(false)
      setFile(null)
    }) */

    try {
      //Upload NFT to IPFS & Filecoin
      const metadata = await nftstorage.store({
          name: 'Harmony NFT collesctxiodn1',
          description: 'This is a Harmony NFT collenction stored on IPFS & Filecoin.',
          image: new File([file], file.name, {type}),
      }).then(result => { 
        addDoc(dbRef, {
          timestamp: "Raja Tamil",
          caption: "Canadte",
          fileUrl: 'asd',
          size: '-',
        });
        console.log(result)
        console.log(metadata.url)
        setUploading(false)
        setOpen(false)
      })
      return metadata;

    } catch (error) {
      console.log("Could not save NFT to NFT.Storage - Aborted minting.");
      console.log(error);
    }

    
  }

  return (
    <div className='newFile'>
        <div className='newFile__container' onClick={handleOpen}>
            <AddIcon/>
            <p>New</p>
        </div>
        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
        >
          <div style={modalStyle} className={classes.paper}>
            <p>Select files you want to upload!</p>
              {
                
                  uploading ? (
                      <p>Uploading...</p>
                  ) : (
                      <>
                        <input type="file" onChange={handleChange} />
                        <button onClick={handleUpload}>Upload</button>
                      </>
                          
                      )
              }
          </div>

        </Modal>
    </div>
  )
}

export default Newfile

/* 

    storage.ref(`files/${file.name}`).put(file).then(snapshot => {
        console.log(snapshot)

        storage.ref('files').child(file.name).getDownloadURL().then(url => {
            //post image inside the db

            db.collection('myFiles').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: file.name,
                fileUrl: url,
                size: snapshot._delegate.bytesTransferred,
            })

            setUploading(false)
            setOpen(false)
            setFile(null)
        })

        storage.ref('files').child(file.name).getMetadata().then(meta => {
            console.log(meta.size)
        })

    }) */

    /* const config = {
      headers: {
        Authorization: NFT_STORAGE_KEY,
        "Content-Type": "application/car",
      },
    };
    axios
      .post("https://api.nft.storage/upload", file, config)
      .then((res) => {
        console.log(res)
        setUploading(false)
        setOpen(false)
        setFile(null)

      })
      .catch((err) => console.log(err)); */