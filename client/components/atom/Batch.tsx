import React from 'react'
import { GoDotFill } from "react-icons/go";

interface BatchProps {
    className?: string;
    color?: string;
    status?: 'pending' | 'resolved' | 'ongoing' 
}


const Batch = ({status, className = '', color ='text-white'}: BatchProps) => {
  return (
    <div className={`${color} ${className}`}>
      <GoDotFill/>
      <p>{status}</p>
    </div>
  )
}

export default Batch
