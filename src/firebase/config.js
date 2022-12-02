import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDDAkO6k9A5iby7aMJMYXIgfk-bbuFbbDk',
  authDomain: 'project-management-site-5f5ef.firebaseapp.com',
  projectId: 'project-management-site-5f5ef',
  storageBucket: 'project-management-site-5f5ef.appspot.com',
  messagingSenderId: '28316382734',
  appId: '1:28316382734:web:9485881a6c18442834ae5f',
};

// init firebase
initializeApp(firebaseConfig);

// init firestore
const projectFirestore = getFirestore();

// init firebase auth
const projectAuth = getAuth();

// init firebase storage
const projectStorage = getStorage();

export { projectFirestore, projectAuth, projectStorage };
