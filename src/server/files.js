import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
} from "firebase/firestore";

const firestore = getFirestore();

const userFilesCollection = doc(firestore, "files/user-id");

const getFile = () => {};

const tutorial = () => {
  // this is being obtained from localstorage
  const document = {
    Home: {
      type: "folder",
      files: {
        Documents: {
          type: "folder",
          files: {
            "document.txt": {
              type: "textfile",
              text: "[x] buy groceries\n[ ] walk the dog\n[x] learn react\n[ ] hit the gym",
            },
          },
        },
        Downloads: {
          type: "folder",
          files: {
            "download.txt": {
              type: "textfile",
              text: "[x] buy groceries\n[ ] walk the dog\n[x] learn react\n[ ] hit the gym",
            },
            HelloWorld: { type: "folder", files: {} },
          },
        },
      },
    },
  };

  // SET DOC

  // overrides current document there
  setDoc(userFilesCollection, document)
    .then((e) => {
      console.log("Done writing", e);
    })
    .catch((e) => {
      console.log("Writing error ", e);
    });
  //   updateDoc(userFilesCollection, document);
  //   setDoc(userFilesCollection, document, { merge: true });
};

async function addNewDocument() {
  // ADD DOC
  const collection = collection(firestore, "files");

  const newDoc = await addDoc(collection, document);
  console.log("New document created", newDoc);
}

export async function readDocument(collectionName, documentId) {
  const userDocument = doc(firestore, `${collectionName}/${documentId}`);
  const mySnapshot = await getDoc(userDocument);

  if (mySnapshot.exists()) {
    const docData = mySnapshot.data();
    return docData;
  }
  return null;
}

export async function writeDocument(collectionName, documentId, value) {
  return await setDoc(doc(firestore, collectionName, documentId), {
    data: value,
  });
}

let ubsubscribe;

function listenToADocument() {
  const userDocument = doc(firestore, "files/user-id");
  ubsubscribe = onSnapshot(userDocument, (docSnapshot) => {
    const docData = docSnapshot.data();
    console.log(`My data is `, docData);
  });
}

function cancelSubscription() {
  ubsubscribe();
}

const queryForDocuments = () => {
  const customerOrdersQuery = query(
    collection(firestore, "orders"),
    where("drink", "==", "latte"),
    orderBy("price")
  );
  getDocs(customerOrdersQuery);
};
