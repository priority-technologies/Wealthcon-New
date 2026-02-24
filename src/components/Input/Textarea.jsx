import { Fragment } from 'react';
import './input.scss';

const Textarea = ({ id, label, className, placeholder, error, ...rest }) => {
  const classes = `${className || ''}`;

  return (
    <Fragment>
      <div className='inputField'>
        {label && (
          <label htmlFor={id} className="block inputLabel">
            {label}
          </label>
        )}
        <div className="mt-1">
          <div className={`rounded-0 mb-4 ${classes}`}>
            <textarea
              id={id}
              autoComplete="off"
              className="py-3 px-4 border rounded-none w-full block"
              placeholder={placeholder}
              {...rest}
            ></textarea>
             {error && <div className="text-red-600">{error}</div>}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Textarea;
