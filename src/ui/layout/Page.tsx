import { FC, ReactNode } from 'react'

import { LoadingIndicator } from 'app/ui/LoadingIndicator'
import { Header } from 'app/ui/layout/Header'

import styles from './Page.module.css'

type PageProps = {
  children: ReactNode
  shouldShowLoadingIndicator?: boolean
}

export const Page: FC<PageProps> = (props) => {
  const { children, shouldShowLoadingIndicator = false } = props

  return (
    <div className={styles.pageWrap}>
      {shouldShowLoadingIndicator && (
        <LoadingIndicator className={styles.loadingIndicatorWrap} />
      )}
      <Header />
      <main>{children}</main>
    </div>
  )
}
