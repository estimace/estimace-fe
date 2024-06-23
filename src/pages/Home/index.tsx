import { Link } from 'app/ui/Link'
import { FC } from 'react'

import { Headline } from 'app/ui/Headline'
import { Text } from 'app/ui/Text'
import { Page } from 'app/ui/layout/Page'

import styles from './index.module.css'

const HomePage: FC = () => {
  return (
    <Page>
      <div className={styles.homePageWrapper}>
        <Headline tag="h1">Estimace: a minimal planning poker app</Headline>
        <Text tag="p">
          For estimating stories and tasks in your Agile team, give Estimace a
          try! It's a fast, real-time, and open-source tool that hones in on the
          essentials, creating a collaborative space known as a "room." Team
          members can easily join the room using a shared URL. Right now,
          Estimace offers support for two popular estimation techniques:
          Fibonacci and T-Shirt sizing.
        </Text>
        <Link to="/r">Create A Room</Link>
      </div>
    </Page>
  )
}

export default HomePage
