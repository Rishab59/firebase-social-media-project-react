import "./poststyles.css";

import { useEffect, useState } from "react" ;

import { useAuthState } from "react-firebase-hooks/auth" ;
import { auth, db } from "../../config/firebase" ;
import { Post as InterfacePost } from "./main" ;

import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore" ;


interface Props{
    post: InterfacePost ;
} ;

interface Like{
    likeId: string ;
    userId:string ;
} ;


export const Post = (props: Props) => {
    const { post } = props ;
    const [user] = useAuthState(auth) ;

    const [likes, setLikes] = useState<Like[] | null>(null) ;

    const likesRef = collection(db, "likes") ;

    const likesDoc = query(likesRef, where("postId", "==", post.id)) ;

    // const getLikes = async () => {
    //     const data = await getDocs(likesDoc) ;
    //     // console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))) ;
    //     setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))) ;
    // } ;

    const addLikes = async () => {
        try{
            const newDoc = await addDoc(likesRef, {
                userId: user?.uid,
                postId: post.id,
            }) ;

            if(user){
                setLikes((prev) => 
                    prev
                        ? 
                            [...prev, { userId: user.uid, likeId: newDoc.id }]
                        :
                            [{ userId: user.uid, likeId: newDoc.id }] 
                ) ;
            }
        }
        catch(err){
            console.log(err) ;
        }
    } ;
    

    const removeLikes = async () => {
        try{
            const likeToDeleteQuery = query(
                likesRef,
                where("postId", "==", post.id),
                where("userId", "==", user?.uid)
            ) ;

            const likeToDeleteData = await getDocs(likeToDeleteQuery) ;

            const likeId = likeToDeleteData.docs[0].id ;
            const likeToDelete = doc(db, "likes", likeId) ;

            await deleteDoc(likeToDelete) ;

            if(user){
                setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId)) ;
            }

        }
        catch(err){
            console.log(err) ;
        }
    } ;

    const didCurrUserLiked = likes?.find((like) => like.userId === user?.uid) ;

    useEffect(() => {
        const getLikes = async () => {
            const data = await getDocs(likesDoc) ;
            // console.log(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))) ;
            setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))) ;
        } ;

        getLikes() ;
    }, [likesDoc]) ;


    return(
        <div className="post-container">
            <div className = "title">
                <h1>
                    { post.title }
                </h1>
            </div>

            <div className = "body">
                <p>
                    { post.description }
                </p>
            </div>

            <div className = "footer">
                <p>
                    @ { post.username }
                </p>
                
                <button onClick = { didCurrUserLiked ? removeLikes : addLikes }>
                    { didCurrUserLiked
                        ? 
                            <>
                                &#128078;
                            </> 
                        : 
                            <>
                                &#128077;
                            </>
                    }
                </button>
                
                { 
                    likes && (
                        <p>
                            Likes : { likes?.length }
                        </p>
                    )
                }
            </div>
        </div>
    ) ;
} ;
