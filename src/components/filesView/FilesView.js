import React, { useState, useEffect } from 'react'
import '../../styles/FilesView.css'

import FileItem from './FileItem'
import FileCard from './FileCard'
import { doc, setDoc, addDoc, collection, getDocs, onSnapshot} from "firebase/firestore"

import { db } from '../../firebase'

function FilesView() {
    
    console.log('pass')
    const [files, setFiles] = useState([])
    console.log('pass')
    const dbRef = collection(db, "myFiles");
    console.log('pass')
    const dbSnapshot = getDocs(dbRef);
    console.log(dbSnapshot)

    useEffect(() => {

      

      
      dbSnapshot
        .then(response => {
          setFiles(response.docs.map(doc => ({
            id: doc.id,
            item: doc.data()
          })))
          console.log(response)
        })
        .catch(error => console.log(error.message))


    
    }, [])

    console.log(files)

    return (
        <div className='fileView'>
            <div className="fileView__row">
                {
                    files.slice(0, 5).map(({ id, item }) => (
                        <FileCard name={item.caption} />
                    ))

                }
            </div>
            <div className="fileView__titles">
                <div className="fileView__titles--left">
                    <p>Name</p>
                </div>
                <div className="fileView__titles--right">
                    <p>Last modified</p>
                    <p>File size</p>
                </div>
            </div>
            {
                files.map(({ id, item }) => (
                    <FileItem id={id} caption={item.caption} fileUrl={item.fileUrl} size={item.size} />
                ))
            }
        </div>
    )
}

export default FilesView


/* dbCol.onSnapshot(snapshot => {timestamp={item.timestamp}
            console.log(snapshot)
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })))
        }) */

/* setFiles(dbSnapshot.docs.map(doc => ({
              id: doc.id,
              item: doc.data()
          })))
    }, []) */




      /* collection(db, "myFiles").onSnapshot(snapshot => {
        setFiles(snapshot.docs.map(doc => ({
          id: doc.id,
          item: doc.data()
        })))
      })
    }, []) */
    /* db.collection('myFiles').onSnapshot(snapshot => {
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })))
        })
    }, []) */