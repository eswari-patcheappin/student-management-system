
"use client";

import {
  Suspense,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type CSSProperties,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type StudentForm = {
  name: string;
  email: string;
  phone: string;
  department: string;
  year: string;
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "15px",
  color: "#111827",
  backgroundColor: "#ffffff",
  outlineColor: "#2563eb",
  boxSizing: "border-box",
};

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "14px",
  fontWeight: 600,
  color: "#374151",
  marginBottom: "8px",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

function EditStudentForm() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [formData, setFormData] = useState<StudentForm>({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStudent() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(`/api/students/${id}`, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch student"
          );
        }

        const student = data.student;

        setFormData({
          name: student.name,
          email: student.email,
          phone: student.phone,
          department: student.department,
          year: String(student.year),
        });
      } catch (err) {
        if (controller.signal.aborted) return;

        setLoadError(
          err instanceof Error
            ? err.message
            : "Something went wrong"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchStudent();

    return () => controller.abort();
  }, [id]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Student name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must contain exactly 10 digits");
      return;
    }

    if (!formData.department || !formData.year) {
      setError("Please select department and year");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/students/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim(),
          email: formData.email.trim(),
          year: Number(formData.year),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update student"
        );
      }

      setSuccess("Student updated successfully!");

      router.push("/students");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f6fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "650px",
          margin: "0 auto",
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "28px" }}>
          <Link
            href="/students"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            ← Back to Students
          </Link>

          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#111827",
              marginTop: "20px",
              marginBottom: "8px",
            }}
          >
            Edit Student
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "15px",
            }}
          >
            Update the student information below.
          </p>
        </div>

        {/* Form Card */}
        <div
          style={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "32px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              fontSize: "19px",
              fontWeight: 600,
              color: "#111827",
              marginBottom: "24px",
            }}
          >
            Student Information
          </h2>

          {loading ? (
            <p style={{ color: "#6b7280" }}>
              Loading student details...
            </p>
          ) : loadError ? (
            <div role="alert">
              <p
                style={{
                  color: "#b91c1c",
                  marginBottom: "16px",
                }}
              >
                {loadError}
              </p>

              <Link href="/students">
                Back to Student List
              </Link>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#fef2f2",
                    color: "#b91c1c",
                    border: "1px solid #fecaca",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#f0fdf4",
                    color: "#15803d",
                    border: "1px solid #bbf7d0",
                    borderRadius: "8px",
                    marginBottom: "20px",
                  }}
                >
                  {success}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "22px",
                }}
              >
                {/* Student Name */}
                <div style={fieldStyle}>
                  <label htmlFor="name" style={labelStyle}>
                    Student Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Email */}
                <div style={fieldStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Email Address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="student@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Phone */}
                <div style={fieldStyle}>
                  <label htmlFor="phone" style={labelStyle}>
                    Phone Number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    style={inputStyle}
                    required
                  />
                </div>

                {/* Department */}
                <div style={fieldStyle}>
                  <label
                    htmlFor="department"
                    style={labelStyle}
                  >
                    Department *
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">
                      Select Department
                    </option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Computer Science">
                      Computer Science
                    </option>
                    <option value="Electronics">
                      Electronics
                    </option>
                    <option value="Mechanical">
                      Mechanical
                    </option>
                    <option value="Civil">
                      Civil
                    </option>
                  </select>
                </div>

                {/* Academic Year */}
                <div style={fieldStyle}>
                  <label htmlFor="year" style={labelStyle}>
                    Academic Year *
                  </label>
                  <select
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "12px",
                    flexWrap: "wrap",
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "24px",
                    marginTop: "8px",
                  }}
                >
                  <Link
                    href="/students"
                    style={{
                      padding: "12px 24px",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      color: "#374151",
                      backgroundColor: "#ffffff",
                      textDecoration: "none",
                      fontWeight: 600,
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: "12px 24px",
                      backgroundColor: saving
                        ? "#93c5fd"
                        : "#2563eb",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "14px",
                      cursor: saving
                        ? "not-allowed"
                        : "pointer",
                    }}
                  >
                    {saving
                      ? "Updating..."
                      : "Update Student"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}


export default function EditStudentPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            backgroundColor: "#f3f6fb",
            padding: "40px 20px",
            textAlign: "center",
            color: "#374151",
          }}
        >
          Loading Edit Student page...
        </main>
      }
    >
      <EditStudentForm />
    </Suspense>
  );
}