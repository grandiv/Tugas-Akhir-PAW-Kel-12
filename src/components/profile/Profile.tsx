"use client";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { FormField } from "@/components/profile/FormField";
import { useProfileForm } from "@/hooks/useProfileForm";

const INITIAL_DATA = {
  nama: "Kelompok 12",
  email: "kelompok12@example.com",
  nohandphone: "081234567890",
  password: "********",
  alamat: "Jl. Grafika No. 2",
  profilePicture: "/defaultprofile.png",
};

const Profile = () => {
  const {
    editedData,
    isEditing,
    handleImageChange,
    handleInputChange,
    handleSubmit,
  } = useProfileForm(INITIAL_DATA);

  return (
    <div className="min-h-screen bg-white pb-20 -mt-4 -mx-[calc((100vw-1536px)/2)]">
      <ProfileHeader
        profilePicture={editedData.profilePicture}
        nama={editedData.nama}
        onImageChange={handleImageChange}
      />

      <div className="relative mx-auto max-w-md">
        <div className="flex justify-end mt-8 mb-2">
          <button className="text-[#0B9343] px-4" onClick={handleSubmit}>
            {isEditing ? "Simpan" : "Edit"}
          </button>
        </div>

        <div className="space-y-[30px]">
          <FormField
            icon={<FaUser className="text-[#868889]" />}
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
