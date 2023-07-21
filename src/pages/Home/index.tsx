import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <div>
      <h1>Estimace</h1>
      <h2>A minimal scrum planning app</h2>
      <p>
        You can choose to use either <i>fibonacci</i> or <i>T-Shirt Sizing</i>{' '}
        techniques
      </p>
      <p>
        To Create a room and start the planning of your sprint click{' '}
        <Link to="/rooms">start</Link>
      </p>
    </div>
  )
}

export default HomePage
