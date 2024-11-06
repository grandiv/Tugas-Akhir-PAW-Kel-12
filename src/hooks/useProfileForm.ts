import { useState } from "react";
import { UserData } from "@/types/profile";

export const useProfileForm = (initialData: UserData) => {
  const [userData, setUserData] = useState<UserData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({
          ...editedData,
          profilePicture: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setEditedData({ ...editedData, profilePicture: "/user.png" });
  };

  const handleInputChange =
    (field: keyof UserData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditedData({ ...editedData, [field]: e.target.value });
    };

  const handleSubmit = () => {
    if (isEditing) {
      setUserData(editedData);
    }
    setIsEditing(!isEditing);
  };

  return {
    userData,
    editedData,
    isEditing,
    handleImageChange,
    handleInputChange,
    handleSubmit,
    handleRemoveImage,
  };
};
