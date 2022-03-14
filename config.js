const firebase=require('firebase');


const firebaseConfig = {
    apiKey: "AIzaSyBM7xINkwLw8bqA4qhJEXk2oMFcUxvugUU",
    authDomain: "interview-98384.firebaseapp.com",
    projectId: "interview-98384",
    storageBucket: "interview-98384.appspot.com",
    messagingSenderId: "1036332029731",
    appId: "1:1036332029731:web:c876c5a2c516ffdc06de96",
    measurementId: "G-SN3C9YD895"
  };

const app=firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const participantsSchema=db.collection("participantsSchema");
const interviewerSchema=db.collection("interviewerSchema");
const intervieweeSchema=db.collection("intervieweeSchema");

module.exports={participantsSchema,interviewerSchema,intervieweeSchema};