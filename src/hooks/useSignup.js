import { useState, useEffect } from 'react';
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from '../firebase/config';
import { useAuthContext } from './useAuthContext';

// firebase imports
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage';
import { collection, setDoc, doc } from 'firebase/firestore';

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const userCredentials = await createUserWithEmailAndPassword(
        projectAuth,
        email,
        password
      );

      if (!userCredentials) {
        throw new Error('Could not complete signup');
      }

      // upload user thumbnail
      const uploadPath = `thumbnails/${userCredentials.user.uid}/${thumbnail.name}`;
      const imgRef = ref(projectStorage, uploadPath);
      const img = await uploadBytes(imgRef, thumbnail);
      const imgUrl = await getDownloadURL(img.ref);

      // add display name to user
      await updateProfile(userCredentials.user, {
        displayName,
        photoURL: imgUrl,
      });

      // create a user document

      const docRef = doc(
        collection(projectFirestore, 'users'),
        userCredentials.user.uid
      );
      const data = {
        online: true,
        displayName,
        photoURL: imgUrl,
      };
      await setDoc(docRef, data);

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: userCredentials.user });

      // update state
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signup, error, isPending };
};
