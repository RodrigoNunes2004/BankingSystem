# Banking System

A comprehensive banking system built with ASP.NET Core Web API and React TypeScript frontend, following Clean Architecture principles.

## 🏗️ Architecture

This project follows Clean Architecture with the following layers:

- **Domain Layer** (`BankingSystem.Domain`): Contains entities, interfaces, and business logic
- **Application Layer** (`BankingSystem.application`): Contains services, DTOs, and application logic
- **Infrastructure Layer** (`BankingSystem.Infrastructure`): Contains data access, repositories, and external services
- **API Layer** (`BankingSystem.API`): Contains controllers and API endpoints
- **Frontend** (`frontend`): React TypeScript application

## 🚀 Features

### Core Banking Operations

- **User Management**: Create, read, update, and delete users
- **Account Management**: Create and manage bank accounts
- **Transaction Processing**:
  - Deposits
  - Withdrawals
  - Transfers between accounts
- **Real-time Dashboard**: Overview of system statistics and recent activity

### Technical Features

- **Clean Architecture**: Separation of concerns with dependency inversion
- **Entity Framework Core**: Database operations with SQL Server
- **AutoMapper**: Object-to-object mapping
- **RESTful API**: Well-structured endpoints with Swagger documentation
- **Modern React**: TypeScript, hooks, and modern UI components
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Backend

- ASP.NET Core 9.0
- Entity Framework Core 9.0
- SQL Server (LocalDB)
- AutoMapper
- Swagger/OpenAPI

### Frontend

- React 18
- TypeScript
- CSS3 (Modern styling with gradients and animations)

## 📋 Prerequisites

- .NET 9.0 SDK
- Node.js 18+
- SQL Server (LocalDB or full instance)
- Visual Studio 2022 or VS Code

## 🚀 Getting Started

### Backend Setup

1. **Navigate to the API project**:

   ```bash
   cd src/BankingSystem.API
   ```

2. **Restore packages**:

   ```bash
   dotnet restore
   ```

3. **Update connection string** in `appsettings.json` if needed:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BankingSystemDb;Trusted_Connection=true;MultipleActiveResultSets=true"
     }
   }
   ```

4. **Create and update database**:

   ```bash
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. **Run the API**:
   ```bash
   dotnet run
   ```

The API will be available at `https://localhost:7000` with Swagger documentation at `https://localhost:7000/swagger`.

### Frontend Setup

1. **Navigate to the frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

The React app will be available at `http://localhost:3000`.

## 📊 Database Schema

### Entities

#### User

- Personal information (name, email, phone, address)
- Account relationships
- Audit fields (created/updated timestamps)

#### Account

- Account number (auto-generated)
- Account type (Savings, Checking, Business, Investment)
- Balance and available balance
- User relationship
- Lock status

#### Transaction

- Transaction type (Deposit, Withdrawal, Transfer)
- Amount and currency
- Source and destination accounts
- Status tracking
- Reference numbers
- Categories

## 🔧 API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Accounts

- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/{id}` - Get account by ID
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transactions

- `GET /api/transactions/account/{accountId}` - Get transactions by account
- `POST /api/transactions/deposit` - Process deposit
- `POST /api/transactions/withdrawal` - Process withdrawal
- `POST /api/transactions/transfer` - Process transfer

## 🎨 Frontend Components

### Dashboard

- System statistics overview
- Recent transactions
- Account summaries
- Quick access to all features

### User Management

- User listing with search and filters
- Create/edit user forms
- User validation and error handling

### Account Management

- Account listing with balance information
- Create/edit account forms
- Account status management

### Transaction Management

- Transaction history
- Deposit processing
- Withdrawal processing
- Transfer processing
- Real-time balance updates

## 🔒 Security Considerations

- Input validation on all endpoints
- SQL injection prevention through Entity Framework
- CORS configuration for frontend communication
- Error handling and logging

## 🚀 Future Enhancements

- [ ] Authentication and authorization
- [ ] Real-time notifications
- [ ] Advanced reporting and analytics
- [ ] Mobile application
- [ ] Integration with external payment systems
- [ ] Audit logging
- [ ] Multi-currency support
- [ ] Interest calculations
- [ ] Loan management
- [ ] Investment tracking

## 📝 Development Notes

### Code Organization

- Each layer has clear responsibilities
- Dependency injection for loose coupling
- Repository pattern for data access
- Service layer for business logic
- DTOs for data transfer

### Error Handling

- Comprehensive error handling in services
- User-friendly error messages
- Proper HTTP status codes
- Frontend error display

### Performance

- Efficient database queries with Entity Framework
- Optimized React components
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please create an issue in the repository or contact the development team.

---

**Happy Banking! 🏦**


