"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ProfileHeader } from "./ProfileHeader";
import { FormField } from "./FormField";
import { useProfileForm } from "@/hooks/useProfileForm";
import LoadingComponent from "../loading";

const Profile = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    editedData,
    isEditing,
    handleImageChange,
    handleInputChange,
    handleSubmit,
    handleRemoveImage,
    initializeData,
    isUploading,
  } = useProfileForm({
    nama: "",
    email: "",
    nohandphone: "",
    password: "",
    alamat: "",
    profilePicture: "/user.png",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/profile");
          const data = await response.json();

          if (data.success) {
            initializeData({
              nama: data.user.nama || "",
              email: data.user.email || "",
              nohandphone: data.user.nohandphone || "",
              password: "********", // Masked password
              alamat: data.user.alamat || "",
              profilePicture: data.user.profilePicture || "/user.png",
            });
          } else {
            setErrorMessage(data.error || "Failed to fetch profile data");
          }
        } catch (error) {
          setErrorMessage("Error loading profile data");
          console.error("Profile fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session]);

  if (isLoading) {
    return <LoadingComponent />;
  }

  const handleImageChangeError = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      await handleImageChange(e);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload image"
      );
    }
  };

  return (
    <div className="min-h-screen bg-white pb-12 w-full px-4 sm:px-6 lg:px-8">
      {errorMessage && (
        <div className="bg-red-100 text-red-600 p-4 mb-4 rounded-lg mx-auto max-w-3xl">
          {errorMessage}
        </div>
      )}
      <ProfileHeader
        profilePicture={editedData.profilePicture}
        nama={editedData.nama}
        onImageChange={handleImageChangeError}
        onRemoveImage={handleRemoveImage}
        isUploading={isUploading}
      />

      <div className="relative mx-auto max-w-md">
        <div className="flex justify-end mt-8 mb-2 px-4 sm:px-0">
          <button
            className="text-[#0B9343] px-4 py-2 rounded-md hover:bg-green-50 transition-colors"
            onClick={handleSubmit}
          >
            {isEditing ? "Simpan" : "Ubah"}
          </button>
        </div>

        <div className="space-y-[30px] px-4 sm:px-6 md:px-0">
          <FormField
            icon={<FaUser className="text-[#868889] min-w-[20px]" />}
            label="Nama"
            value={editedData.nama}
            isEditing={isEditing}
            onChange={handleInputChange("nama")}
          />
          <FormField
            icon={<FaEnvelope className="text-[#868889]" />}
            label="Email"
            value={editedData.email}
            isEditing={isEditing}
            onChange={handleInputChange("email")}
          />
          <FormField
            icon={<FaPhone className="text-[#868889]" />}
            label="No. Handphone"
            value={editedData.nohandphone}
            isEditing={isEditing}
            onChange={handleInputChange("nohandphone")}
          />
          {isEditing && (
            <FormField
              icon={<FaLock className="text-[#868889]" />}
              label="Password"
              value={editedData.password}
              type="password"
              isEditing={isEditing}
              onChange={handleInputChange("password")}
            />
          )}
          <FormField
            icon={<FaMapMarkerAlt className="text-[#868889]" />}
            label="Alamat"
            value={editedData.alamat}
            isEditing={isEditing}
            onChange={handleInputChange("alamat")}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
