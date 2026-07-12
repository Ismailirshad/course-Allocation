/**
 * Sample Dataset for Course Allocation System
 * This file contains mock data for courses and students in standard array format.
 */

export const courses = [
  {
    name: "Computer Science & Engineering",
    code: "CSE",
    totalSeats: 5,
    reservedSeats: {
      OBC: 1,
      SC: 1,
      ST: 1
    },
    isActive: true
  },
  {
    name: "Electronics & Communication",
    code: "ECE",
    totalSeats: 4,
    reservedSeats: {
      OBC: 1,
      SC: 1,
      ST: 0
    },
    isActive: true
  },
  {
    name: "Mechanical Engineering",
    code: "MECH",
    totalSeats: 3,
    reservedSeats: {
      OBC: 1,
      SC: 0,
      ST: 0
    },
    isActive: true
  }
];

export const students = [
  {
    studentId: "STU001",
    name: "Amit Sharma",
    marks: 95,
    category: "General",
    applicationDate: "2026-07-01T10:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU002",
    name: "Priya Patel",
    marks: 92,
    category: "OBC",
    applicationDate: "2026-07-02T09:30:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU003",
    name: "Rohan Verma",
    marks: 88,
    category: "SC",
    applicationDate: "2026-07-03T11:15:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU004",
    name: "Suresh Meena",
    marks: 85,
    category: "ST",
    applicationDate: "2026-07-04T14:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU005",
    name: "Anjali Rao",
    marks: 94,
    category: "General",
    applicationDate: "2026-07-01T11:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU006",
    name: "Vikram Singh",
    marks: 94,
    category: "General",
    applicationDate: "2026-07-01T09:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU007",
    name: "Deepak Kumar",
    marks: 89,
    category: "OBC",
    applicationDate: "2026-07-02T12:00:00.000Z",
    preference1: "ECE",
    preference2: "CSE",
    preference3: "MECH"
  },
  {
    studentId: "STU008",
    name: "Komal Yadav",
    marks: 78,
    category: "OBC",
    applicationDate: "2026-07-05T10:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU009",
    name: "Rahul Gond",
    marks: 75,
    category: "ST",
    applicationDate: "2026-07-06T09:00:00.000Z",
    preference1: "CSE",
    preference2: "ECE",
    preference3: "MECH"
  },
  {
    studentId: "STU010",
    name: "Sneha Biswas",
    marks: 82,
    category: "SC",
    applicationDate: "2026-07-04T16:30:00.000Z",
    preference1: "ECE",
    preference2: "MECH",
    preference3: "CSE"
  }
];
