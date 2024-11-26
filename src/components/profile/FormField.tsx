import { FormFieldProps } from "@/types/profile";

export const FormField = ({
  icon,
  label,
  value,
  isEditing,
  type = "text",
  onChange,
}: FormFieldProps) => (
  <div className="relative">
    <div className="flex items-center bg-[#F4F5F9] rounded-lg p-4">
      <span className="mr-3">{icon}</span>
      <div className="flex-1">
        <label className="block text-sm text-[#868889] mb-1">{label}</label>
        {isEditing ? (
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-transparent focus:outline-none"
          />
        ) : (
          <p className="flex-1 text-sm text-gray-600 break-words">
            {type === "password" ? "********" : value}
          </p>
        )}
      </div>
    </div>
  </div>
);
