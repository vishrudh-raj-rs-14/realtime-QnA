// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { firebaseConfig } from "../../config";

// firebase.initializeApp(firebaseConfig);

// const auth = firebase.auth();

// const signInWithGoogle = async () => {
//   const provider = new firebase.auth.GoogleAuthProvider();
//   const response = await auth.signInWithPopup(provider);
//   if (response.user) {
//     const userRef = db.collection("users").doc(response.user.uid);
//     await userRef.set(
//       {
//         "Created At": formatDateTime(new Date()),
//         "Display Name": response.user.displayName,
//         Email: response.user.email,
//         "Last Signed In": formatDateTime(new Date()),
//       },
//       { merge: true }
//     );
//   }

//   return response;
// };

// const signOut = async () => {
//   auth.signOut();
// };

// const db = firebase.firestore();

// function formatDateTime(date: Date): string {
//   const options: Intl.DateTimeFormatOptions = {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//   };

//   return new Intl.DateTimeFormat("en-US", options).format(date);
// }

// const createSession = async () => {
//   const sessionRef = db.collection("sessions").doc();
//   await sessionRef.set({
//     "Created At": formatDateTime(new Date()),
//     "Created By": auth.currentUser?.uid,
//   });

//   return sessionRef.id;
// };

// const upVote = async (
//   sessionId: string,
//   questionId: string,
//   userId: string
// ) => {
//   const sessionRef = db.collection("sessions").doc(sessionId);
//   const questionRef = sessionRef.collection("questions").doc(questionId);
//   const upVote = questionRef.collection("upVotes").doc(userId);
//   await upVote.set({
//     "Upvoted At": formatDateTime(new Date()),
//     "Upvoted By": auth.currentUser?.uid,
//   });
//   console.log("upvoted");
// };

// const removeVote = async (
//   sessionId: string,
//   questionId: string,
//   userId: string
// ) => {
//   const sessionRef = db.collection("sessions").doc(sessionId);
//   const questionRef = sessionRef.collection("questions").doc(questionId);
//   const upVote = questionRef.collection("upVotes").doc(userId);
//   await upVote.delete();
// };

// export {
//   auth,
//   signInWithGoogle,
//   signOut,
//   useAuthState,
//   db,
//   createSession,
//   upVote,
//   removeVote,
// };
