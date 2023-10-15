import { Link } from 'react-router-dom'
import styles from './index.module.css'

function NotFound() {
  return (
    <div className={styles.notFoundPageWrapper}>
      <h1>Whoops!</h1>
      <h2>It looks like the page you're looking for has disappeared.</h2>
      <p>Please check the URL </p>
      <p>
        Or navigate to our <Link to="/">homepage</Link> to find your way.
      </p>
    </div>
  )
}

export default NotFound
