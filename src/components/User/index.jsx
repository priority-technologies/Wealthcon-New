import Image from "next/image";
import logo from "@/assets/images/thumb-logo.jpg";

function User({ className = "", image = null, name, email }) {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="w-10 h-10 relative">
          <Image
            className="bg-gray-200 rounded-full w-10 h-10"
            src={image || logo}
            alt="Picture of the author"
            fill={true}
            loading="lazy"
          />
        </div>

        <div className="flex-1">
          <h4 className="font-medium text-sm text-black lowercase">
            {name}
          </h4>

          <div className="mt-0.5 text-xs">{email}</div>
        </div>
      </div>
    </div>
  );
}

export default User;
