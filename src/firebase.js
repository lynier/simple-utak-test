import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  databaseURL:
    "https://simple-utak-test-7b081-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "simple-utak-test-7b081",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
