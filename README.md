# UniShip - Shipping Management System

UniShip is a modern, full-featured shipping management system built with Angular 17, designed to help businesses efficiently manage their shipping operations, track shipments, and handle customer relationships.

![UniShip Logo](src/assets/logo.png)

## Features

### Core Functionality
- **Shipment Management**
  - Create and track shipments
  - Real-time shipment status updates
  - Detailed shipment history
  - Multi-point delivery tracking

- **Customer Management**
  - Customer profiles and history
  - Address management
  - Communication history
  - Customer-specific shipping preferences

- **Branch Management**
  - Branch network management
  - Branch-specific operations
  - Staff assignment
  - Resource allocation

- **Vehicle Fleet Management**
  - Vehicle tracking and assignment
  - Maintenance scheduling
  - Capacity management
  - Route optimization

### Technical Features
- Modern Angular 17 architecture with standalone components
- Reactive state management using Angular Signals
- Lazy-loaded feature modules for optimal performance
- Responsive design for all device sizes
- Real-time updates and notifications
- Comprehensive error handling
- Type-safe development with TypeScript
- Clean and maintainable code structure

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Angular CLI (v17.0.0 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/uniship.git
cd uniship
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
ng serve
```

4. Navigate to `http://localhost:4200` in your browser

### Environment Setup

Create an `environment.ts` file in the `src/environments` directory:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-api-url'
};
```

## Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── components/      # Shared components
│   │   ├── guards/         # Route guards
│   │   ├── interceptors/   # HTTP interceptors
│   │   ├── interfaces/     # TypeScript interfaces
│   │   └── services/       # Core services
│   ├── features/           # Feature modules
│   │   ├── auth/          # Authentication
│   │   ├── shipments/     # Shipment management
│   │   ├── customers/     # Customer management
│   │   ├── branches/      # Branch management
│   │   └── vehicles/      # Vehicle management
│   └── shared/             # Shared functionality
│       ├── components/     # Reusable components
│       ├── pipes/         # Custom pipes
│       └── directives/    # Custom directives
├── assets/                 # Static assets
└── environments/           # Environment configurations
```

## Key Components

### Authentication
- JWT-based authentication
- Role-based access control
- Secure route protection
- Token refresh mechanism

### Data Management
- Reactive forms with validation
- Real-time data updates
- Optimistic UI updates
- Error handling and recovery

### UI Components
- Modern, responsive design
- Material Design influence
- Custom form controls
- Data tables with sorting and filtering
- Loading indicators
- Toast notifications

## Development

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Implement proper error handling
- Write comprehensive documentation
- Maintain consistent naming conventions

### Testing
```bash
# Run unit tests
ng test

# Run end-to-end tests
ng e2e
```

### Building for Production
```bash
ng build --configuration production
```

## API Integration

The application integrates with a RESTful API. Key endpoints include:

- Authentication: `/auth/login`
- Shipments: `/shipments`
- Customers: `/customers`
- Branches: `/branches`
- Vehicles: `/vehicles`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Support

For support, email support@uniship.com or create an issue in the repository.

## Acknowledgments

- Angular team for the amazing framework
- All contributors who have helped shape this project
- The open-source community for their invaluable tools and libraries

---

© 2024 UniShip. All rights reserved.
