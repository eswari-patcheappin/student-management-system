
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

interface StudentTableProps {
  onStudentDeleted?: () => void;
}

export default function StudentTable({
  onStudentDeleted,
}: StudentTableProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  // Fetch students from API
  useEffect(() => {
    async function fetchStudents() {
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

    fetchStudents();
  }, []);

  // Delete student with confirmation
  async function handleDelete(student: Student) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${student.name}?`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");
    setDeletingId(student._id);

    try {
      const response = await fetch(
        `/api/students/${student._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to delete student"
        );
      }

      // Remove deleted student from UI
      setStudents((previous) =>
        previous.filter(
          (item) => item._id !== student._id
        )
      );

      setSuccess(
        `${student.name} deleted successfully!`
        );
        onStudentDeleted?.();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // Get unique departments
  const departments = [
    "All",
    ...new Set(
      students.map((student) => student.department)
    ),
  ];

  // Search and filter students
  const filteredStudents = students.filter((student) => {
    const matchesName = student.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All" ||
      student.department === selectedDepartment;

    return matchesName && matchesDepartment;
  });

  // Table cell styles
  const cellStyle = {
    padding: "16px 24px",
    textAlign: "left" as const,
    border: "1px solid #ddd",
    color: "#111827",
  };

  // Loading state
  if (loading) {
    return (
      <p style={{ padding: "20px" }}>
        Loading students...
      </p>
    );
  }

  return (
    <div>
      {/* Error message */}
      {error && (
        <p
          role="alert"
          style={{
            color: "#dc2626",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      )}

      {/* Success message */}
      {success && (
        <p
          role="status"
          style={{
            color: "#16a34a",
            marginBottom: "16px",
          }}
        >
          {success}
        </p>
      )}

      {/* Search and Department Filter */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Search by name */}
        <input
          type="text"
          placeholder="Search students by name..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            width: "100%",
            maxWidth: "350px",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#111827",
            backgroundColor: "#ffffff",
          }}
        />

        {/* Filter by department */}
        <select
          value={selectedDepartment}
          onChange={(event) =>
            setSelectedDepartment(event.target.value)
          }
          aria-label="Filter by department"
          style={{
            padding: "12px",
            minWidth: "220px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#111827",
            backgroundColor: "#ffffff",
            cursor: "pointer",
          }}
        >
          {departments.map((department) => (
            <option
              key={department}
              value={department}
            >
              {department === "All"
                ? "All Departments"
                : department}
            </option>
          ))}
        </select>

        {/* Clear filters */}
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setSelectedDepartment("All");
          }}
          style={{
            padding: "12px 16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            backgroundColor: "#f3f4f6",
            color: "#111827",
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>

      {/* Student count */}
      <p
        style={{
          marginBottom: "16px",
          color: "#374151",
        }}
      >
        Showing {filteredStudents.length} of{" "}
        {students.length} students
      </p>

      {/* Empty state or student table */}
      {filteredStudents.length === 0 ? (
        <p style={{ marginTop: "20px" }}>
          {error && students.length === 0
            ? "Unable to load students."
            : students.length === 0
              ? "No students available."
              : "No matching students found."}
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
              backgroundColor: "#ffffff",
            }}
          >
            <thead>
              <tr>
                {[
                  "Name",
                  "Email",
                  "Phone",
                  "Department",
                  "Year",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      ...cellStyle,
                      backgroundColor: "#f3f4f6",
                      fontWeight: 600,
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
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

                  {/* Actions */}
                  <td style={cellStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {/* Edit button */}
                      <Link
                        href={`/students/edit/${student._id}`}
                        style={{
                          display: "inline-block",
                          padding: "8px 16px",
                          backgroundColor: "#2563eb",
                          color: "#ffffff",
                          borderRadius: "6px",
                          textDecoration: "none",
                          fontWeight: 500,
                        }}
                      >
                        Edit
                      </Link>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(student)
                        }
                        disabled={deletingId !== null}
                        style={{
                          padding: "8px 16px",
                          backgroundColor: "#dc2626",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            deletingId !== null
                              ? "not-allowed"
                              : "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {deletingId === student._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
