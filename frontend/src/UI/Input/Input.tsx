import React, { useState } from 'react';
import classes from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClass?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
     ({ label, error, containerClass = '', className = '', id, value, onChange, ...props }, ref) => {
     const [isFocused, setIsFocused] = useState(false);
     
     const shouldFloat = isFocused || (value !== undefined && value !== '' && value !== null);

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
               onChange(e);
          }
     };

          return (
               <div className={`${classes.form__group} ${containerClass}`}>
                    <input
                         ref={ref}
                         id={id}
                         className={`${classes.form__field} ${className} ${error ? classes.error : ''}`}
                         onFocus={() => setIsFocused(true)}
                         onBlur={() => setIsFocused(false)}
                         value={value}
                         onChange={handleChange} 
                         {...props}
                    />
                    {label && (
                         <label 
                              htmlFor={id} 
                              className={`${classes.form__label} ${shouldFloat ? classes.floated : ''}`}
                         >
                              {label}
                         </label>
                    )}
                    {error && <span className={classes.errorMessage}>{error}</span>}
               </div>
          );
     }
);

export default Input;