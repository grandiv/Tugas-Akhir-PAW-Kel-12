import Image from "next/image";
import { FaCamera, FaTrash } from "react-icons/fa";

interface ProfileHeaderProps {
  profilePicture: string;
  nama: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  isUploading?: boolean;
}

export const ProfileHeader = ({
  profilePicture,
  nama,
  onImageChange,
  onRemoveImage,
  isUploading = false,
}: ProfileHeaderProps) => (
  <>
    <div className="h-48 bg-[#0B9343]" />
    <div className="relative -mt-24 mx-auto max-w-md">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200">
            <div className="relative w-full h-full">
              <Image
                src={profilePicture}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>
          <label
            className={`absolute bottom-2 right-2 bg-[#0B9343] p-2 rounded-full cursor-pointer hover:bg-green-700 ${
              isUploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white rounded-full border-t-transparent" />
            ) : (
              <FaCamera className="text-white" />
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
              disabled={isUploading}
            />
          </label>
          <button
            onClick={onRemoveImage}
            className="bg-red-500 absolute p-2 bottom-2 left-2 rounded-full cursor-pointer hover:bg-red-600"
          >
            <FaTrash className="text-white" />
          </button>
        </div>
      </div>
      <h2 className="text-center text-2xl font-semibold mt-4 mb-8">{nama}</h2>
    </div>
  </>
);
