import { useState } from "react";
import { UserData } from "@/types/profile";
import { useSession } from "next-auth/react";

export const useProfileForm = (initialData: UserData) => {
  const { update: updateSession } = useSession();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);
  const [isUploading, setIsUploading] = useState(false);

  const initializeData = (data: UserData) => {
    setUserData(data);
    setEditedData(data);
  };

  const handleRemoveImage = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setEditedData({ ...editedData, profilePicture: "/user.png" });
        if (session?.user) {
          await updateSession({
            ...session.user,
            image: "/user.png",
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error removing profile picture:", error);
      throw error;
    }
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
          await updateSession({
            ...data.user,
            name: data.user.nama,
            image: data.user.profilePicture,
          });
        } else {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    }
    setIsEditing(!isEditing);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      const uploadData = await uploadResponse.json();
      if (!uploadData.success) {
        throw new Error(uploadData.error);
      }

      const updateResponse = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editedData,
          profilePicture: uploadData.url,
        }),
      });

      const data = await updateResponse.json();
      if (data.success) {
        setEditedData({ ...editedData, profilePicture: uploadData.url });
        if (session?.user) {
          await updateSession({
            ...session.user,
            image: uploadData.url,
          });
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    userData,
    editedData,
    isEditing,
    handleImageChange,
    handleInputChange,
    handleSubmit,
    handleRemoveImage,
    initializeData,
    isUploading,
  };
};
