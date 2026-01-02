import React from 'react'
import { FiPlus } from "react-icons/fi";

const ButtonBoolean = ({
  children,
  setState,
}) => {
  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => setState(prev => !prev)}
      ><FiPlus size={20} className='mr-2'/>{children}</button>
    </div>
  )
}

export default ButtonBoolean;