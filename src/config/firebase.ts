// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app" ;
import { getAuth, GoogleAuthProvider } from "firebase/auth" ;
import { getFirestore } from "firebase/firestore" ;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "social-media-project-react-59.firebaseapp.com",
  projectId: "social-media-project-react-59",
  storageBucket: "social-media-project-react-59.appspot.com",
  messagingSenderId: "",
  appId: ""
} ;


// Initialize Firebase
const app = initializeApp(firebaseConfig) ;

export const auth = getAuth(app) ;
export const provider = new GoogleAuthProvider() ;
export const db = getFirestore(app) ;

// Added Shruti
