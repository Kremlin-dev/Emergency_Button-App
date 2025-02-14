import React from 'react'
import Text from '../atom/Text'
import Media from '../atom/Media'

const Navbar = () => {
  return (
    <nav>
      <Text>Logo</Text>

      <ul>
        <li><Media text /> Home</li>
        <li><Media icon="info" /> About</li>
        <li><Media icon="user" /> Contact</li>
        <li><Media icon="cart" /> Cart</li>
        <li><Media icon="search" /> Search</li>
      </ul>

      <div></div>

    </nav>
  )
}

export default Navbar
