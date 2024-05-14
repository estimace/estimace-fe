import { Link } from 'react-router-dom'
import { FC } from 'react'

import styles from './index.module.css'

const HomePage: FC = () => {
  return (
    <div className={styles.homePageWrapper}>
      <h1>Estimace</h1>
      <h2>A minimal planning poker app for Agile teams</h2>
      <p>
        Although we can argue about the effectiveness of estimates and story
        points all day long, but you can find yourself here and there in a
        situation that you need to provide estimates. if that happens at least
        you deserve a to the point app to help your team with it. Estimace is
        here to help you with that. That's where <strong>Estimace</strong> steps
        in.
      </p>
      <p>
        All you need to do is to create a room for your planning session and
        share the link of it with your teammates. Then you can start estimating
        your stories.
      </p>
      <p>
        <Link to="/r">Create A Room</Link>
      </p>
    </div>
  )
}

export default HomePage
