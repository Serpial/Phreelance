import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { getAppStorage } from "../util/firebase";
import { useAuth } from "../contexts/AuthContext";

const useCloudStorage = () => {
  const { appUser } = useAuth();
  const appStorage = getAppStorage();

  const uploadProfilePhoto = (file) => {
    const storageRef = ref(appStorage, `images/${appUser.id}/${file.name}`);
    return uploadBytes(storageRef, file);
  };

  const fetchProfilePhoto = (location) => {
    const fileRef = ref(appStorage, location);
    return getDownloadURL(fileRef);
  };

  return { uploadProfilePhoto, fetchProfilePhoto };
};

export default useCloudStorage;
