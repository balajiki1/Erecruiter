
# e-recruiter

## Overview
This project is a modern frontend application built using React and Material-UI, aimed at delivering a dynamic user interface.

## Features
- Modern styling with Emotion CSS-in-JS and Material-UI components.
- Icon support via Font Awesome.
- Responsive design for multiple screen sizes.

## Getting Started

### Prerequisites
- Node.js and npm installed on your system.
- MongoDB.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/balajiki1/Info6150FinalProjectErecuiter.git
   ```

2. Navigate to the project directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:
```bash
npm start
```

### Building for Production

To create a production-ready build, run:
```bash
npm run build
```

The optimized output will be in the `build` folder.

## Project Structure

- **public/**: Contains static files like `index.html`, logos, and manifest.
- **src/**: Contains the main source code for the application.
  - **components/**: Reusable React components.
  - **pages/**: Page-level components for different views.
  - **styles/**: Custom CSS or Emotion styling files.

## Key Dependencies

### Main Dependencies
- `@emotion/react`: CSS-in-JS utility for React.
- `@emotion/styled`: Styled components for React.
- `@fortawesome/free-solid-svg-icons`: Solid Font Awesome icons.
- `@fortawesome/react-fontawesome`: Font Awesome for React.
- `@mui/material`: Material-UI component library.

## Backend

## Features
- User authentication and authorization with JWT.
- Password hashing using bcryptjs for secure storage.
- CORS enabled for cross-origin requests.
- Modular structure with controllers and models.

## Getting Started

### Installation

1. Navigate to the project directory:
   ```bash
   cd api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=3000
   DB_URI=<your-database-uri>
   JWT_SECRET=<your-jwt-secret>
   ```

### Running the Application

To start the development server, run:
```bash
npm start
```

### Project Structure

- **`api.js`**: Entry point of the application.
- **`server.js`**: Initializes the server and connects middleware.
- **`db.js`**: Handles database connections.
- **`controllers/`**: Contains route logic for different resources.
- **`models/`**: Defines data schemas and models.

### API Endpoints

#### Example Routes:
1. **User Authentication**:
   - `POST /api/login`: User login.
   - `POST /api/register`: Register a new user.

2. **Job Management**:
   - `GET /api/jobs`: Retrieve all jobs.
   - `POST /api/jobs`: Create a new job.

3. **Candidate Management**:
   - `GET /api/candidates`: Retrieve all candidates.
   - `POST /api/candidates`: Add a new candidate.

### Key Dependencies

- `bcryptjs`: Secure password hashing.
- `cors`: Middleware for enabling CORS.
- `express`: Web framework for Node.js.
- `jsonwebtoken`: Authentication via JWT.