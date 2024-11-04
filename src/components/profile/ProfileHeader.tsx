import Image from "next/image";
import { FaCamera } from "react-icons/fa";

interface ProfileHeaderProps {
  profilePicture: string;
  nama: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({
  profilePicture,
  nama,
  onImageChange,
}: ProfileHeaderProps) => (
  <>
    <div className="h-48 bg-[#0B9343]" />
    <div className="relative px-4 -mt-24 mx-auto max-w-md">
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
          <label className="absolute bottom-2 right-2 bg-[#0B9343] p-2 rounded-full cursor-pointer">
            <FaCamera className="text-white" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onImageChange}
            />
          </label>
        </div>
      </div>
      <h2 className="text-center text-2xl font-semibold mt-4 mb-8">{nama}</h2>
    </div>
  </>
);
