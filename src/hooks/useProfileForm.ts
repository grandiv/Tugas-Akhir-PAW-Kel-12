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

  const handleSubmit = async () => {
    if (isEditing) {
      try {
        const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedData),
        });
        const data = await response.json();
        if (data.success) {
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
      }
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
