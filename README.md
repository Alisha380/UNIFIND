# UniFind – Campus Lost & Found Application

**UniFind** is a campus-based Lost and Found application designed to help university students report, search, and recover lost or found belongings easily.

The application provides a centralized platform where students can share lost and found item reports, search for specific items, and connect with the campus community.

## Features

- **Lost Item Reporting:** Submit reports for belongings that have been lost on campus.
- **Found Item Reporting:** Upload details of items found around the university.
- **Image Upload:** Attach images to item reports.
- **Search Functionality:** Search for items using relevant keywords.
- **Category Filtering:** Filter reports according to item categories.
- **Date and Location Filtering:** Find reports using date and location information.
- **Report Management:** View, update, and delete reports.
- **User-Friendly Interface:** Simple and easy-to-use mobile application interface.

## Technologies Used

### Frontend
- React Native
- Expo
- TypeScript
- JavaScript

### Backend
- Node.js
- Express.js
- MySQL
- REST API

### Testing
- Jest
- React Native Testing Library / TypeScript testing utilities

### Development Tools
- Visual Studio Code
- Git and GitHub
- Expo Go

## Project Structure

```text
UNIFIND/
│
├── UNIFINDAPP/
│   └── UNIFINDAPP/
│       ├── app/
│       ├── assets/
│       ├── components/
│       ├── constants/
│       ├── hooks/
│       ├── utils/
│       └── __tests__/
│
├── unifind-backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── repo-temp/
│   └── __tests__/
│
├── unifind database.sql
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Alisha380/UNIFIND.git
```

### 2. Setup Backend

```bash
cd UNIFIND/unifind-backend
npm install
```

Configure your MySQL database connection and backend settings before starting the server.

Import the `unifind database.sql` file into MySQL.

Start the backend:

```bash
node server.js
```

### 3. Setup Frontend

Open another terminal:

```bash
cd UNIFIND/UNIFINDAPP/UNIFINDAPP
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Scan the QR code using Expo Go to run the application on your mobile device.

**Note:** Configure the frontend API URL with your backend's accessible IP address and port before running the application.

## Testing

The project includes automated tests for frontend and backend functionality.

Run frontend tests:

```bash
cd UNIFIND/UNIFINDAPP/UNIFINDAPP
npm test -- --runInBand
```

Run backend tests:

```bash
cd UNIFIND/unifind-backend
npm test
```

## Project Objective

The main objective of UniFind is to reduce the difficulty of recovering lost belongings within a university campus by providing an organized, accessible, and centralized Lost and Found system.

## Developer

**Alisha Noman**

Bachelor of Software Engineering  
Riphah International University

## Repository

[GitHub – UniFind](https://github.com/Alisha380/UNIFIND)

---

*UniFind – Making Lost Things Found Again!* 
