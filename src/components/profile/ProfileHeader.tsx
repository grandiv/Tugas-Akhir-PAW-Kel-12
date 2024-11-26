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
    <div className="h-32 sm:h-48 bg-[#0B9343] -mx-8" />
    <div className="relative -mt-16 sm:-mt-24 max-w-3xl px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
            <div className="relative w-full h-full">
              <Image
                src={profilePicture}
                alt="Profile"
                layout="fill"
                objectFit="cover"
                priority
                className="transition-opacity duration"
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
