
# Student Management System

A full-stack Student Management System developed using Next.js, TypeScript, MongoDB, and Mongoose.

## Features

- Dashboard displaying total students
- View student records in a table
- Add new students with form validation
- Edit existing student information
- Delete students with confirmation
- Search students by name
- Filter students by department
- Loading, success, and error messages
- Responsive student management interface

## Technologies Used

- Next.js 16
- React
- TypeScript
- MongoDB Atlas
- Mongoose
- CSS

## Project Structure

```text
app/
  api/
    students/
      route.ts
      [id]/
        route.ts
  students/
    add/
      page.tsx
    edit/
      [id]/
        page.tsx
    page.tsx
  page.tsx

components/
  StudentTable.tsx

lib/
  mongodb.ts

models/
  Student.ts
```

## Installation

1. Clone the repository:

   git clone https://github.com/YOUR_USERNAME/student-management-system.git

2. Open the project:

   cd student-management-system

3. Install dependencies:

   npm install

4. Create a `.env.local` file in the project root:

   MONGODB_URI=your_mongodb_connection_string

5. Start the development server:

   npm run dev

6. Open http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | Fetch all students |
| POST | /api/students | Add a student |
| GET | /api/students/:id | Fetch a student |
| PUT | /api/students/:id | Update a student |
| DELETE | /api/students/:id | Delete a student |

## Student Fields

- Name
- Email
- Phone Number
- Department
- Academic Year

## Author

YOUR_NAME

## License

Created for educational purposes.
