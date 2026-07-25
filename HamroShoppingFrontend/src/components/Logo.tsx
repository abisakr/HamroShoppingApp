import React from 'react'

interface LogoProps {
  w?: number
  h?: number
}

const Logo: React.FC<LogoProps> = ({ w = 160, h = 60 }) => {
  return (
    <div
      style={{ width: w, height: h }}
      className="bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold hover:opacity-80 transition"
    >
      🛍️
    </div>
  )
}

export default Logo
