import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  className: string;
};

const Button = ({ label, className, ...other }:ButtonProps)=> {
  return (
    <button
    {...other}
      className={`px-4 py-2 ${className}`}
    >
      {label}
    </button>
  );
};
export default Button