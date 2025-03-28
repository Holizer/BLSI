import { FC } from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';

interface LinkProps extends NavLinkProps {
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    disabled?: boolean;
}

const Link: FC<LinkProps> = ({
    to,
    className,
    onClick,
    disabled = false,
    children
}) => {
     const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (disabled) {
               event.preventDefault();
               return;
          }

          window.scrollTo({ top: 0, behavior: 'smooth' });
          if (onClick) {
               onClick(event);
          }
     };

     return (
          <NavLink
               to={to}
               className={className}
               onClick={handleClick}
               aria-disabled={disabled}
          >
               {children}
          </NavLink>
     );
};

export default Link;