import { Fragment } from "react";
import "./input.scss";

const Select = ({
  label,
  options,
  className,
  value,
  defaultValue = "",
  ...rest
}) => {
  const classes = `${className || ""}`;

  return (
    <Fragment>
      <div className="selectField">
        <select
          className={` ${classes} select  `}
          value={value === null ? "" : value}
          // defaultValue={defaultValue}
          {...rest}
        >
          <option value="" disabled >
            {label || "Select"}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </Fragment>
  );
};

export default Select;
