import { FC } from 'react'
import { Link } from 'react-router-dom'

import EstimaceLogo from 'app/assets/EstimaceLogo'

import styles from './Header.module.css'

export const Header: FC = () => {
  return (
    <header className={styles.headerWrap}>
      <Link to="/" className={styles.logoLink}>
        <EstimaceLogo />
      </Link>
    </header>
  )
}
