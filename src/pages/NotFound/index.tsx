import { FC } from 'react'

import { Link } from 'app/ui/Link'
import { Page } from 'app/ui/layout/Page'
import { Headline } from 'app/ui/Headline'
import { Text } from 'app/ui/Text'

import styles from './index.module.css'

const NotFound: FC = () => {
  return (
    <Page>
      <div className={styles.notFoundPageWrapper}>
        <Headline>Page not found!</Headline>
        <Text>
          It looks like the page you're looking for does not exist. Please check
          the URL or navigate to our <Link to="/">homepage</Link> to find your
          way.
        </Text>
      </div>
    </Page>
  )
}

export default NotFound
