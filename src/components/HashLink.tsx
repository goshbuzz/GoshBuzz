import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HashLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  smooth?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function HashLink({
  to,
  smooth = true,
  children,
  className,
  onClick,
  ...rest
}: HashLinkProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }

    // Check if it's an external link or normal link without hash
    if (!to.includes('#')) {
      return;
    }

    const [pathname, hash] = to.split('#');
    const targetPath = pathname || '/';
    const isSamePage =
      location.pathname === targetPath ||
      (location.pathname === '' && targetPath === '/');

    if (isSamePage) {
      e.preventDefault();
      const elem = document.getElementById(hash);
      if (elem) {
        elem.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
      }
      // Update window URL hash cleanly without reload
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState(null, '', `${targetPath}#${hash}`);
      }
    } else {
      // Let standard Link or navigate handle cross-page navigation
      e.preventDefault();
      navigate(to);
      setTimeout(() => {
        const elem = document.getElementById(hash);
        if (elem) {
          elem.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
        }
      }, 100);
    }
  };

  return (
    <Link to={to} onClick={handleClick} className={className} {...(rest as any)}>
      {children}
    </Link>
  );
}

export default HashLink;
