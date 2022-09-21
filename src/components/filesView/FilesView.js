import React, { useState, useEffect } from 'react'
import '../../styles/FilesView.css'

import FileItem from './FileItem'
import FileCard from './FileCard'
import { doc, setDoc, addDoc, collection, getDoc, onSnapshot} from "firebase/firestore"

import { db } from '../../firebase'

const FilesView = async () => {
    const [files, setFiles] = useState([])
    const dbRef = collection(db, "myFiles");
    const dbSnapshot = await getDoc(dbRef);

    useEffect(() => {

      
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
    


        collection(db, 'myFiles').onSnapshot(snapshot => {
            console.log(snapshot)
            setFiles(snapshot.docs.map(doc => ({
                id: doc.id,
                item: doc.data()
            })))
        })
    }, [])

    console.log(files)

    return (
        <div className='fileView'>
            <div className="fileView__row">
                {
                    files.slice(0, 5).map(({ id, item }) => (
                        {/* <FileCard name={item.caption} /> */}
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
                    <FileItem id={id} caption={item.caption} timestamp={item.timestamp} fileUrl={item.fileUrl} size={item.size} />
                ))
            }
        </div>
    )
}

export default FilesView