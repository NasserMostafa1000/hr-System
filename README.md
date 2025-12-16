# HR Management System

A comprehensive system for managing companies and employees, with tracking of passport, ID, and license expiry dates.

## Features

- ✅ Login
- ✅ Add and manage companies
- ✅ Add and manage employees
- ✅ Upload images (profile photo, passport, ID)
- ✅ Comprehensive statistics:
  - Number of employees in each company
  - Employees whose passports are about to expire
  - Employees whose IDs are about to expire
  - Companies whose licenses are about to expire
- ✅ View statistics for a specific company

## Technologies Used

### Backend

- ASP.NET Core 8.0 Web API
- Entity Framework Core
- SQL Server
- BCrypt for password hashing/verification

### Frontend

- React.js 18
- Vite
- Tailwind CSS
- React Router
- Axios

## Requirements

- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB أو SQL Server Express)

## How to Run

### 1. Run Backend

cd HrSystem.API
dotnet restore
dotnet runThe API will run on `http://localhost:5000`.

### 2. Run Frontend

cd frontend
npm install
npm run devThe app will run on `http://localhost:5173`.

## Default Login Credentials

- **Username:** admin  
- **Password:** admin123

## Project Structure

HrSystem/
├── HrSystem.API/          # Backend API
│   ├── Controllers/       # API Controllers
│   ├── Models/            # Data Models
│   ├── DTOs/              # Data Transfer Objects
│   ├── Data/              # DbContext
│   ├── Services/          # Business Logic Services
│   └── wwwroot/           # Static Files (Uploads)
│
└── frontend/              # React Frontend
    ├── src/
    │   ├── components/    # React Components
    │   ├── pages/         # Page Components
    │   ├── context/       # React Context
    │   └── App.jsx        # Main App Component
    └── package.json## API Endpoints

### Authentication

- `POST /api/auth/login` – Login
- `POST /api/auth/register` – Register a new account

### Companies

- `GET /api/companies` – Get all companies
- `GET /api/companies/{id}` – Get a specific company
- `POST /api/companies` – Add a new company
- `PUT /api/companies/{id}` – Update a company
- `DELETE /api/companies/{id}` – Delete a company

### Employees

- `GET /api/employees` – Get all employees
- `GET /api/employees/{id}` – Get a specific employee
- `POST /api/employees` – Add a new employee (with file uploads)
- `PUT /api/employees/{id}` – Update an employee
- `DELETE /api/employees/{id}` – Delete an employee

### Statistics

- `GET /api/statistics` – Get global statistics
- `GET /api/statistics/company/{companyId}` – Get statistics for a specific company

## Notes

- Uploaded files are stored in `wwwroot/uploads/`.
- The database is created automatically on first run.
- A default user is created automatically if it does not exist.

## License

This project is open source and available for free use.
