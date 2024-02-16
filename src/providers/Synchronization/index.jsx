import SynchronizationProviderContext from "./context";
import { readDocument, writeDocument } from "~/server/files";
import { getAuth } from "firebase/auth";

export default function SynchronizationProvider(props) {
  const write = async (collection, value) => {
    const user = getAuth().currentUser;
    if (!user) {
      return;
    }
    const data = await writeDocument(`${collection}`, `${user.uid}`, value);
    return data;
  };
  const read = async (collection) => {
    const user = getAuth().currentUser;
    if (!user) {
      return;
    }
    const data = await readDocument(collection, user.uid);
    return data;
  };

  return (
    <SynchronizationProviderContext.Provider
      value={{
        write,
        read,
      }}
    >
      {props.children}
    </SynchronizationProviderContext.Provider>
  );
}
