
# Holidaze

Welcome to **Holidaze**, your one-stop destination for booking and managing venues. This web application allows users to browse and book venues for events or holidays, while venue managers can list, edit, and manage their own venues and view bookings made by customers.

## Table of Contents

- [Holidaze](#holidaze)
  - [Table of Contents](#table-of-contents)
  - [About the Project](#about-the-project)
  - [Features](#features)
  - [Built With](#built-with)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
  - [Usage](#usage)
  - [Testing](#testing)
    - [Special Instructions for Testers](#special-instructions-for-testers)
    - [Important Notes](#important-notes)
  - [Deployment](#deployment)
  - [Contact](#contact)
  - [Acknowledgments](#acknowledgments)

## About the Project

**Holidaze** is a React-based web application designed to simplify the process of booking venues for customers and managing venues for venue managers. It provides an intuitive interface, secure authentication, and seamless integration with the Holidaze API.

## Features

- **User Authentication**: Secure registration and login functionality with JWT authentication.
- **Venue Browsing**: Explore a wide range of venues with detailed information and images.
- **Booking System**: Book venues for specific dates and manage your bookings.
- **Venue Management**: Venue managers can create, update, and delete venues, and view bookings for their venues.
- **Responsive Design**: Mobile-first design ensures usability across all devices.
- **Modals for Forms**: Login and registration forms are accessible via modals for a smoother user experience.

## Built With

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Bootstrap](https://getbootstrap.com/)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [React Calendar](https://www.npmjs.com/package/react-calendar)
- [Date-fns](https://date-fns.org/)
- [Holidaze API](https://docs.noroff.dev/holidaze) (provided by Noroff School of Technology and Digital Media)

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

- **Node.js and npm**: Ensure you have Node.js (version 14 or later) and npm installed. You can download them from the [official website](https://nodejs.org/).

  Verify installation by running:

  ```bash
  node -v
  npm -v
  ```

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/martindyr/holidaze.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd holidaze
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

### Running the Application

To run the application in development mode:

```bash
npm start
```

This will start the application on [http://localhost:3000](http://localhost:3000). The app will automatically reload if you make changes to the code.

## Usage

- **Accessing the Application**: Open your browser and navigate to [http://localhost:3000](http://localhost:3000).
- **Registering an Account**:
  - Click the **Register** button in the header to open the registration modal.
  - Fill in the required information. If you are a venue manager, make sure to check the **Venue Manager** option.
- **Logging In**:
  - Click the **Login** button in the header to open the login modal.
  - Enter your credentials to log in.
- **Browsing Venues**:
  - Navigate to the **Venues** page to see a list of available venues.
  - Click on a venue to see more details.
- **Booking a Venue**:
  - Select your desired dates using the calendar.
  - Specify the number of guests.
  - Confirm your booking.
- **Managing Bookings**:
  - After logging in, access **My Bookings** from the header to view and manage your bookings.
- **Venue Management** (for Venue Managers):
  - Access **My Venues** from the header to manage your venues.
  - Create new venues or edit existing ones using the modals.
  - View bookings for each venue directly on the **My Venues** page.

## Testing

### Special Instructions for Testers

- **API Access**:
  - The application interacts with the Holidaze API at `https://v2.api.noroff.dev`.
  - An API key is required and has been hardcoded into the application for testing purposes: `'db9e7b5a-4cf1-4d0d-8be6-f625cfc61f44'`.

- **Test User Accounts**:
  - You can register new user accounts using the registration modal.
  - To test venue management features, ensure you check the **Venue Manager** option during registration.

- **Environment Variables**:
  - No additional environment variables are required for testing.
  - If you need to override any defaults, you can create a `.env` file in the root directory.

### Important Notes

- **Data Persistence**:
  - Since the application uses the provided API, data created during testing (such as new venues or bookings) will be persistent.
  - Please refrain from deleting or altering venues or bookings that you did not create.

- **Testing on Different Devices**:
  - The application is responsive. Testing on various devices and screen sizes is encouraged to ensure consistent behavior.

## Deployment

To build the application for production:

```bash
npm run build
```

This command will create an optimized production build in the `build` directory. You can then deploy the contents of this directory to your preferred hosting service.

## Contact

For any inquiries or issues, please contact:

- **[Your Name]**
- **Email**: [martindhusby@hotmail.com](mailto:martindhusby@hotmail.com)
- **GitHub**: [martindyr](https://github.com/martindyr)

## Acknowledgments

- **Noroff School of Technology and Digital Media**: For providing the API and project framework.
- **React and Bootstrap Communities**: For the excellent tools and documentation.
- **Contributors**: Thank you to everyone who has contributed to this project.
