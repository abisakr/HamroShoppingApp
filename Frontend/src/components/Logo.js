import React from 'react'
import logo from '../assest/NavLogo.png';
const Logo = ({w,h}) => {
  return (
    <img  src={logo} alt="Logo" width={w} height={h}/>
  )
}

export default Logo