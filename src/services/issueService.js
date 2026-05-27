import {
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

import { db } from "../firebase/config";

export const getIssues = async () => {

    const q = query(
        collection(db, "issues"),
        orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

};