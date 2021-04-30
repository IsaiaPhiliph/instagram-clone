// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseApp = {
    apiKey: "AIzaSyDKJ72rHyxiRzd-0k-KCEgbVjR_2eDvy7k",
    authDomain: "instagram-clone-f261d.firebaseapp.com",
    projectId: "instagram-clone-f261d",
    storageBucket: "instagram-clone-f261d.appspot.com",
    messagingSenderId: "116080639443",
    appId: "1:116080639443:web:b46a0ae1ae1128e511c326",
    measurementId: "G-E7NCNEJTT4",
};
firebase.initializeApp(firebaseApp);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
