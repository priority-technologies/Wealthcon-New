import Image from "next/image";
import "./button.scss";

const Button = ({
  type = "button",
  size = "",
  children,
  variant,
  className,
  icon,
  iconPosition = "left",
  iconSize = { width: 24, height: 24 },
  onClick,
  loading,
  disabled,
  ...rest
}) => {
  const Size = size || "";
  const classes = `btn uppercase border rounded-lg ${Size} ${variant || ""} ${
    className || ""
  }`;

  return (
    <button
      type={type}
      className={classes}
      {...rest}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <div className="btn-loader"></div>}
      {icon && iconPosition === "left" && (
        <Image
          src={icon}
          alt="icon"
          width={iconSize.width}
          height={iconSize.height}
        />
      )}
      {children}
      {icon && iconPosition === "right" && (
        <Image
          src={icon}
          alt="icon"
          width={iconSize.width}
          height={iconSize.height}
        />
      )}
    </button>
  );
};

export default Button;
