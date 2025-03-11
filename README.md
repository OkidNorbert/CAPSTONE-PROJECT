# CAPSTONE-PROJECT
The modern job market presents significant challenges for both employers and job seekers.  Employers struggle to find qualified candidates efficiently, while job seekers face a fragmented  and often overwhelming application process



# Web Application Directory Structure

job-portal/
├── client/                      # Frontend React application
│   ├── public/
│   │   ├── index.html
│   │   └── assets/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   └── ProtectedRoute.js
│   │   │   ├── dashboard/
│   │   │   │   ├── EmployerDashboard.js
│   │   │   │   ├── JobSeekerDashboard.js
│   │   │   │   └── AdminDashboard.js
│   │   │   ├── jobs/
│   │   │   │   ├── JobList.js
│   │   │   │   ├── JobPost.js
│   │   │   │   ├── JobSearch.js
│   │   │   │   └── JobApplication.js
│   │   │   └── shared/
│   │   │       ├── Navbar.js
│   │   │       ├── Footer.js
│   │   │       └── Loading.js
│   │   ├── pages/             # Main page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Helper functions
│   │   ├── context/           # React context
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                     # Backend Node.js/Express application
│   ├── config/
│   │   ├── database.js        # MySQL configuration
│   │   └── jwt.js             # JWT configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   └── applicationController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── job.routes.js
│   │   └── application.routes.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── validators.js
│   ├── app.js
│   └── server.js
│
├── docs/                       # Documentation
│   ├── api/
│   │   └── swagger.yaml
│   ├── database/
│   │   └── schema.sql
│   └── postman/
│       └── collection.json
│
├── tests/                      # Test files
│   ├── unit/
│   └── integration/
│
├── .env.example
├── .gitignore
├── README.md
└── package.json


## Key Components Description

Frontend (client/)

1. components/: Reusable UI components
   - auth/: Authentication related components
   - dashboard/: Different user type dashboards
   - jobs/: Job posting and application components
   - shared/: Common components like navbar
