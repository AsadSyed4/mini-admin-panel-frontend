# Mini Admin Panel - Backend (VUE3 + VITE)
The Mini Admin Panel is a web application built using modern web technologies and frameworks, including Vue 3, Vite, and several other libraries. It provides the following features:

## Authentication
Admins can log in to access the system.

## Dashboard
Admins can view statistics.

## Companies
Admins can perform CRUD (Create, Read, Update, Delete) operations for companies.

## Employees
Admins can perform CRUD operations for employees.

## Project Structure
The project is structured as follows:

- `src/`: Contains the source code for the application.
  - `src/components/`: Vue components for different parts of the application.
  - `src/views/`: Vue views for various pages.
  - `src/router/`: Vue Router setup and routing configuration.
  - `src/composables/userSession/`: Application state management using Pinia.
  - `src/composables/useApi/`: API calls and Axios configurations.
- `public/`: Static assets.
- `vite.config.ts`: Vite configuration file.

## Installation and Setup
Before running the project, ensure that you have Node.js and npm installed. Follow these steps to set up the project:

1. Clone the repository: git clone https://github.com/AsadSyed4/mini-admin-panel-frontend.git
2. Navigate to the project directory: cd mini-admin-panel-frontend
3. Install dependencies: npm install
4. To start the development server, use the following command: npm run dev
5. This will launch the application locally, and you can access it in your browser at http://localhost:5173.

## Building for Production
To build the application for production, run:
- npm run build

This will create a production-ready build in the dist/ directory.

## Testing
The project uses Vitest for unit testing. To run tests, use the following command: npm run test:unit

## Linting and Code Formatting
To ensure code quality, the project uses ESLint and Prettier. You can lint and format the code using the following commands:
- npm run lint       # Lint the code
- npm run format     # Format the code

## Dependencies
The project relies on several external dependencies, listed in the `package.json` file. Key dependencies include:

- **Vue 3:** JavaScript framework for building the application's user interface.
- **Vite:** Build tool and development server.
- **Axios:** For making HTTP requests to the backend.
- **Vee-Validate:** Used for form validation.
- **Vue Router:** Handles client-side routing.
- **Pinia:** State management for Vue 3.
- **Yup:** Another form validation library.
- **@vueuse/core:** Collection of Vue Composition API utilities.
- Other development and testing-related dependencies.

Ensure you have these dependencies installed before running the application.

# Conclusion
The Mini Admin Panel is a sophisticated web application designed to streamline company and employee management. You can explore the codebase, run the development server, and build upon this foundation to create a robust and efficient admin panel for your organization.
