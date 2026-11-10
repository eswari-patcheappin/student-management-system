
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  year: number;
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/students");

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to fetch students"
          );
        }

        setStudents(data.students);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  const cellStyle = {
    padding: "14px 20px",
    textAlign: "left" as const,
    borderBottom: "1px solid #e5e7eb",
    color: "#111827",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Dashboard Header */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "12px",
        }}
      >
        Student Management Dashboard
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "30px",
        }}
      >
        Welcome to the Student Management System.
      </p>

      {/* Total Students Card */}
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "24px",
          maxWidth: "320px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            color: "#4b5563",
            marginBottom: "12px",
          }}
        >
          Total Students
        </h2>

        {loading ? (
          <p style={{ color: "#6b7280" }}>
            Loading...
          </p>
        ) : error ? (
          <p style={{ color: "#dc2626" }}>
            Unable to load students
          </p>
        ) : (
          <p
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: "#2563eb",
            }}
          >
            {students.length}
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "35px",
        }}
      >
        <Link
          href="/students"
          style={{
            padding: "12px 20px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          View Students
        </Link>

        <Link
          href="/students/add"
          style={{
            padding: "12px 20px",
            backgroundColor: "#16a34a",
            color: "#ffffff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Add Student
        </Link>
      </div>

      {/* Student Details Section */}
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "20px",
        }}
      >
        Student Details
      </h2>

      {loading ? (
        <p>Loading student details...</p>
      ) : error ? (
        <p role="alert" style={{ color: "#dc2626" }}>
          {error}
        </p>
      ) : students.length === 0 ? (
        <p>No students available.</p>
      ) : (
        <div
          style={{
            overflowX: "auto",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f3f4f6",
                }}
              >
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Department",
                  "Year",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      ...cellStyle,
                      fontWeight: 600,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td style={cellStyle}>
                    {student.name}
                  </td>

                  <td style={cellStyle}>
                    {student.email}
                  </td>

                  <td style={cellStyle}>
                    {student.phone}
                  </td>

                  <td style={cellStyle}>
                    {student.department}
                  </td>

                  <td style={cellStyle}>
                    {student.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
