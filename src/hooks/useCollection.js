import { useEffect, useState, useRef } from 'react';
import { projectFirestore } from '../firebase/config';

// firebase imports
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export const useCollection = (c, _q, _order) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  // if we don't use a ref --> infinite loop in useEffect
  // _q is an array and is "different" on every function call
  const q = useRef(_q).current;

  const order = useRef(_order).current;

  useEffect(() => {
    let ref = collection(projectFirestore, c);

    if (q) {
      ref = query(ref, where(...q), orderBy(...order));
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError('could not fetch the data');
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, q, order]);

  return { documents, error };
};
