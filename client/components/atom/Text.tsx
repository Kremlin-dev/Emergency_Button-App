import React from 'react'

interface TextProps {
    children: React.ReactNode;
    className?: string;
    color?: string;
}


const Text = ({children, className = '', color ='text-white'}: TextProps) => {
  return (
    <p className={`${color} ${className}`}>
      {children}
    </p>
  )
}

export default Text
