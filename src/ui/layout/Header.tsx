import { FC } from 'react'

import EstimaceLogo from 'app/assets/EstimaceLogo'

import styles from './Header.module.css'

export const Header: FC = () => {
  return (
    <header className={styles.headerWrap}>
      <div className={styles.logoWrap}>
        <EstimaceLogo />
      </div>
    </header>
  )
}
