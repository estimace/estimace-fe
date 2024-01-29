# Estimace front-end

For estimating stories and tasks in your Agile team, give Estimace a try! It's a fast, real-time, and open-source tool that hones in on the essentials, creating a collaborative space known as a "room." Team members can easily join the room using a shared URL. Right now, Estimace offers support for two popular estimation techniques: Fibonacci and T-Shirt sizing. You can either use it for free by visiting [estimace.com](https://www.estimace.com/) or self-host it. Happy estimating! 😊

## Development
clone Estimace front-end to your local machine. Then
to install its dependencies run

```sh
yarn install
```

Create a copy of .env.sample file and call it .env; the default backend API URL is provided in the .env.sample.

```sh
cp .env.sample .env
```

You have to setup [Estimace backend](https://gitlab.com/estimace/estimace-be) project and make sure the server and DB is up and running; The instruction to set it up is provided in its README file.

## Deployment
Application can be deployed using Docker. clone the repo and run the docker build command inside the project's directory.

```sh
docker build -t estimace-fe:latest .
```

then create a container from the created image.

## Technologies
 - **React**: Utilized for the frontend development of user interfaces.
 - **Vite**: used as the bundler for the React app; It's a fast build tool for modern web development, and supports typescript out of the box.
 - **TypeScript**: A superset of JavaScript that adds static types, enhancing code quality and maintainability in the React app
 - **WebSocket**: Utilizing WebSocket, the app offers real-time features for enhanced user interaction and live updates for newly joined payers in the room and the status of estimates.
 - **Playwright**: Used for integration testing, Playwright ensures the reliability and functionality of the React app across different scenarios.
 - **Prettifier**: Code formatting is maintained with Prettier, ensuring a consistent and clean codebase.
 - **ESLint**: The project utilizes ESLint for static code analysis, helping catch potential issues and enforcing coding standards.
 - **Docker**: The React app is containerized using Docker, providing consistency in deployment across various environments.
 - **Nginx**: A high-performance web server used to serve the React app, ensuring efficient handling of HTTP requests
 - **Gitlab CI**: Used gitlab continuous integration service to make the app's pipeline to ensure the app is in ready for production after each development change.

## Configuration
The `.env.sample` file gives you the default port for the frontend and the `API-URL`. Just copy it, rename the copy to `.env`, and you're good to go. If you've tweaked the backend app's config, remember to update the environmental config in the frontend's `.env` file.

## Testing

Playwright is used to add integration testing; duo to the app's modest scale it is opted for the integration tests only, therefore no unit testing is done. Before running the tests, make sure you have the necessary dependencies installed.

Since the CI/CD service provided by Gitlab automatically sets the env.CI variable, this variable appropriately is used in the Playwright's config file to trigger the correct mode for Playwright tests. If you are using another CI/CD service make sure this environment variable is present.

### running headless integration tests:

```sh
yarn test:integration
```

### Running integration tests in UI mode:

```sh
yarn test:integration:ui
```

## License:

Estimace front-end is distributed under the MIT License. See the `LICENSE` file for more details. Feel free to use, modify, and distribute the software in accordance with the terms of the MIT License.