import { useEffect, useState } from 'react';
import { projectFirestore } from '../firebase/config';

// firebase imports
import { onSnapshot, doc } from 'firebase/firestore';

export const useDocument = (c, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // realtime document data
  useEffect(() => {
    const docRef = doc(projectFirestore, c, id);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        // need to make sure the doc exists & has data
        if (snapshot.data()) {
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          setError('No such document exists');
        }
      },
      (err) => {
        console.log(err.message);
        setError('failed to get document');
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [c, id]);

  return { document, error };
};
