import React from 'react'

import Item from './Item'
import Extra from './Extra'
import Footer from './Footer'

import { APP_PAGES } from 'data/app-pages'
import s from './Header.scss'

const Menu = ({ menuHeight, screenWidth }) => (
  <nav className={s.menu} style={{ maxHeight: menuHeight }}>
    <menu className={s.list}>
      {APP_PAGES.base.map((el, i) => (
        <Item {...el} screenWidth={screenWidth} key={i} />
      ))}
      <span className={s.block} />
      {APP_PAGES.other.map((el, i) => (
        <Extra {...el} key={i} />
      ))}
    </menu>
    {screenWidth < 667 && <Footer />}
  </nav>
)

export default Menu
