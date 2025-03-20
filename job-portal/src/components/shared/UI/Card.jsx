import React from 'react';

const Card = ({ 
  children, 
  title, 
  className = "",
  headerAction
}) => {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {(title || headerAction) && (
        <div className="flex justify-between items-center mb-4">
          {title && <h2 className="text-xl font-semibold">{title}</h2>}
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;