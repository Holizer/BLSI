import React from 'react';
import classes from './Select.module.scss';

interface SelectOption {
     value: string | number;
     label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
     label?: string;
     options: SelectOption[];
     error?: string;
     containerClass?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
     ({ label, options, error, containerClass = '', className = '', ...props }, ref) => {
          return (
               <div className={`${classes.select__wrapper} ${containerClass}`}>
                    <select
                         ref={ref}
                         className={`${classes.select} ${className} ${error ? classes.error : ''}`}
                         {...props}
                    >
                         {options.map((option) => (
                         <option key={option.value} value={option.value}>
                              {option.label}
                              </option>
                         ))}
                    </select>
                    {error && <span className={classes.errorMessage}>{error}</span>}
               </div>
          );
     }
);

export default Select;