# Course Allocation System (AI-Powered)

An intelligent, reservation-aware Course Allocation System built with **Next.js**, **React**, **Zustand**, **Tailwind CSS**, and **MongoDB**. The system automates the seat allocation process based on student merit, application time (tie-breaker), and reservation categories (General, OBC, SC, ST), while integrating an **AI Assistant** powered by **Google Gemini (gemini-2.5-flash)** to provide instant insights and natural language analytics on the allocation results.

---

## Table of Contents
1. [Key Features](#key-features)
2. [Project Structure](#project-structure)
3. [Database Schema](#database-schema)
4. [Setup & Installation](#setup--installation)
5. [Seeding the Database (Sample Dataset)](#seeding-the-database-sample-dataset)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [AI Assistant Integration](#ai-assistant-integration)
9. [Screenshots & Demo](#screenshots--demo)
10. [Submission Package Details](#submission-package-details)

---

## Key Features
- **Merit & Reservation-Aware Allocation**: Automatically allocates seats based on Student Marks (descending) and Application Date (ascending) as a tie-breaker.
- **Seat Reservations**: Supports category-based quotas (OBC, SC, ST) with general/open seat fallback where all students compete for open seats first.
- **AI Assistant**: A sidebar panel where users can ask questions like *"How many students were allocated to CSE?"* or *"Show category-wise allocation summary"* and get immediate answers using RAG (Retrieval-Augmented Generation) on the allocation results.
- **Real-Time Analytics**: Visualizes total students, allocated vs. unallocated counts, seat availability per pool (Open, OBC, SC, ST), and rejection rates per course.
- **Interactive Forms**: Easily register new students with up to 3 preferences and add new courses with custom seat capacities and reservations.

---

## Project Structure
```text
courseAllocation-system/
├── app/
│   ├── api/                      # Next.js API Routes (Backend)
│   │   ├── allocation/           # Allocation execution and dashboard statistics
│   │   ├── assistant/            # AI Assistant endpoint querying Gemini
│   │   ├── courses/              # Course CRUD endpoints
│   │   └── students/             # Student registration and retrieval
│   ├── globals.css               # Tailwind global CSS styles
│   ├── layout.js                 # App root layout
│   └── page.js                   # Application home rendering Dashboard
├── components/                   # React UI Components
│   ├── AssistantPanel.jsx        # AI Assistant Chat Panel
│   ├── CourseForm.jsx            # Form to register new courses
│   ├── StudentForm.jsx           # Form to register new students with preferences
│   └── Dashboard.jsx             # Main dashboard shell, metrics, and tables
├── lib/                          # Helper functions & database connectors
│   ├── api.js                    # Axios client instance
│   ├── db.js                     # MongoDB connection pool & caching
│   ├── gemini.js                 # Google GenAI client configuration
│   └── getDashboardData.js       # Aggregate query function for dashboard statistics
├── models/                       # Mongoose Database Models
│   ├── Allocation.js             # Schema for student allocation outcomes
│   ├── AllocationRun.js          # Schema for tracking batch allocation runs
│   ├── Course.js                 # Schema for courses and category seat limits
│   └── Student.js                # Schema for students and academic/demographic profile
├── data.js                       # Sample dataset file (array format)
├── store/                        # Zustand Frontend State Manager
│   └── allocationStore.js        # Global state for frontend API communications
├── .env.example                  # Environment template file
├── .env.local                    # Active configuration variables (MongoDB & Gemini API)
├── package.json                  # Dependencies and scripts
└── tailwind.config.js            # Tailwind CSS configuration styling
```

---

## Database Schema

The system uses **MongoDB** via **Mongoose** for schema definitions and validations.

### 1. Course Schema (`models/Course.js`)
Stores course properties and reservation configurations.
- `name` (String, Required): Name of the course (e.g., "Computer Science").
- `code` (String, Required, Unique): Course identification code (e.g., "CSE").
- `totalSeats` (Number, Required): Total available seats.
- `reservedSeats` (Object):
  - `OBC` (Number, Default 0): Seats reserved for OBC students.
  - `SC` (Number, Default 0): Seats reserved for SC students.
  - `ST` (Number, Default 0): Seats reserved for ST students.
- `isActive` (Boolean, Default true): Soft delete/active status flag.

### 2. Student Schema (`models/Student.js`)
Stores student demographic profile, merits, and course preferences.
- `studentId` (String, Required, Unique, Trimmed): Unique student registration ID (e.g., "STU-1001").
- `name` (String, Required, Trimmed): Full name.
- `marks` (Number, Required, 0 to 100): Academic score used for merit sorting.
- `category` (String, Required, Enum): `["General", "OBC", "SC", "ST"]`.
- `applicationDate` (Date, Required): Date of submission (used as a secondary sort key).
- `preference1` (ObjectId, Ref: "Course", Required): First choice course.
- `preference2` (ObjectId, Ref: "Course"): Second choice course.
- `preference3` (ObjectId, Ref: "Course"): Third choice course.
- **Indexes**: Compound index `{ marks: -1, applicationDate: 1 }` for optimized merit list sorting.

### 3. Allocation Schema (`models/Allocation.js`)
Tracks the specific outcome of each student for a given batch run.
- `run` (ObjectId, Ref: "AllocationRun", Required): References the batch run context.
- `student` (ObjectId, Ref: "Student", Required): References the student.
- `course` (ObjectId, Ref: "Course"): References the allocated course (null if unallocated).
- `status` (String, Required, Enum): `["allocated", "unallocated"]`.
- `category` (String, Enum): Category seat pool consumed by the student (e.g., General, OBC, SC, ST).
- `allocatedPreference` (Number): The preference number that was successfully allocated (1, 2, or 3).
- `seatPool` (String): The source pool where seat was consumed (`"Open"`, `"OBC"`, `"SC"`, or `"ST"`).
- `reason` (String): Reason for allocation status (e.g., "No seats available in preferred courses").
- **Indexes**: Compound unique index `{ run: 1, student: 1 }` to prevent duplicate allocations per run.

### 4. Allocation Run Schema (`models/AllocationRun.js`)
Logs the execution history of allocation batches.
- `status` (String, Enum): `["completed", "failed"]`.
- `totalStudents` (Number): Total students processed.
- `allocatedCount` (Number): Count of successfully allocated students.
- `unallocatedCount` (Number): Count of unallocated students.

---

## Setup & Installation

### Prerequisites
- **Node.js**: Version 18.x or higher
- **MongoDB**: A running local MongoDB instance or a MongoDB Atlas cloud URI
- **Google Gemini API Key**: To enable the AI Assistant

### Installation Steps

1. **Extract / Clone the repository** to your local machine.
2. Open a terminal in the root directory and install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root directory (you can copy `.env.example` as a template):
   ```bash
   cp .env.example .env.local
   ```
4. Open `.env.local` and configure your credentials:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   GEMINI_API_KEY=your-gemini-api-key
   ```

---

## Sample Dataset (data.js)

A sample dataset containing courses and students is provided in the project root file:
- **[data.js](data.js)**

### Data Structures:
- **Courses Array**: Consists of 3 courses:
  - `CSE` (Computer Science & Engineering): 5 seats (3 Open, 1 OBC, 1 SC, 1 ST)
  - `ECE` (Electronics & Communication): 4 seats (2 Open, 1 OBC, 1 SC, 0 ST)
  - `MECH` (Mechanical Engineering): 3 seats (2 Open, 1 OBC, 0 SC, 0 ST)
- **Students Array**: Consists of 10 students with academic marks ranging from 75 to 95 and varying reservation categories (General, OBC, SC, ST) with preferred courses.

---

## Running the Application

Start the local development server:
```bash
npm run dev
```

The application will launch on [http://localhost:3000](http://localhost:3000).

---

## API Documentation

All routes reside under `/api/*` and return JSON payloads.

### 1. Courses API
- **`GET /api/courses`**
  - **Description**: Retrieves all active courses sorted alphabetically by name.
  - **Response**:
    ```json
    {
      "success": true,
      "courses": [
        {
          "_id": "64b0f...",
          "name": "Computer Science & Engineering",
          "code": "CSE",
          "totalSeats": 5,
          "reservedSeats": { "OBC": 1, "SC": 1, "ST": 1 },
          "isActive": true
        }
      ]
    }
    ```
- **`POST /api/courses`**
  - **Description**: Adds a new course.
  - **Payload**:
    ```json
    {
      "name": "Civil Engineering",
      "code": "CIVIL",
      "totalSeats": 30,
      "reservedSeats": { "OBC": 8, "SC": 4, "ST": 2 }
    }
    ```

- **`PATCH /api/courses/[id]`**
  - **Description**: Updates course details.
- **`DELETE /api/courses/[id]`**
  - **Description**: Soft deletes a course (sets `isActive: false`).

### 2. Students API
- **`GET /api/students`**
  - **Description**: Retrieves all registered students sorted by marks desc and applicationDate asc. Populates references for preference fields.
- **`POST /api/students`**
  - **Description**: Registers a new student.
  - **Payload**:
    ```json
    {
      "studentId": "STU101",
      "name": "Jane Doe",
      "marks": 89,
      "category": "OBC",
      "applicationDate": "2026-07-10T08:00:00.000Z",
      "preference1": "COURSE_MONGO_ID_1",
      "preference2": "COURSE_MONGO_ID_2",
      "preference3": "COURSE_MONGO_ID_3"
    }
    ```

### 3. Allocation API
- **`POST /api/allocation/run`**
  - **Description**: Runs the allocation engine. Clears previous allocations for the new run, sorts students, allocates matching seats according to merit & reservations, and logs the run.
  - **Response**:
    ```json
    {
      "success": true,
      "message": "Allocation completed successfully.",
      "runId": "RUN_MONGO_ID",
      "totalStudents": 10,
      "allocated": 8,
      "unallocated": 2
    }
    ```
- **`GET /api/allocation/dashboard`**
  - **Description**: Aggregates and returns active allocation run analytics, statistics, available seat details (split by pool), and course rejection rates.

### 4. AI Assistant API
- **`POST /api/assistant/ask`**
  - **Description**: Send a natural language query about allocation data to the Gemini model.
  - **Payload**:
    ```json
    {
      "question": "How many students were allocated to each course?"
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "answer": "Here is the allocation breakdown:\n- Computer Science: 5 students\n- Electronics: 3 students\n- Mechanical: 0 students"
    }
    ```

---

## AI Assistant Integration

The AI Assistant utilizes the new `@google/genai` SDK and queries the **`gemini-2.5-flash`** model. It uses **Context-Injected Retrieval-Augmented Generation (RAG)**:
1. When a user asks a question, the backend fetches the complete aggregated allocation results and metrics from `getDashboardData()`.
2. A prompt is compiled, embedding the retrieved JSON data as context, along with strict instructions:
   > *"Answer only using the dashboard data provided. Do not make up any information. If the answer is not available in the data, reply: 'I couldn't find that information.'"*
3. Gemini processes the query and returns a structured, friendly response to the UI.

---

## Screenshots & Demo

A high-fidelity screenshot of the dashboard interface showing the metrics, allocated tables, available seats, and the AI Assistant interaction is available in the repository root:
- **[Dashboard Screenshot (dashboard_screenshot.jpg)](dashboard_screenshot.jpg)**

---

## Submission Package Details

To submit this project, zip the directory containing the following elements (all of which are present):
1. **Source Code**: All Next.js and Mongoose modules.
2. **Database Schema**: Documented in this file and implemented in `/models`.
3. **Setup Instructions & API Doc**: Written here in `README.md`.
4. **Sample Dataset**: Provided in array format via `data.js` and described in this file.
5. **Screenshots**: `dashboard_screenshot.jpg` in the root.
6. **Architecture Document**: Provided in `ARCHITECTURE.md`.
