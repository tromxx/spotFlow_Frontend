import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBeCVBJffwWmZKthsES0jbR3pMw-RLOydU",
  authDomain: "spotflow-5475a.firebaseapp.com",
  projectId: "spotflow-5475a",
  storageBucket: "spotflow-5475a.appspot.com",
  messagingSenderId: "347692009729",
  appId: "1:347692009729:web:66bae26e0c389b9a74f300",
  measurementId: "G-NG0FQ52HVF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);