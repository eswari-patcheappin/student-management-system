
import Link from "next/link";
import StudentTable from "@/components/StudentTable";

export default function StudentsPage() {
  return (
    <main
      style={{
        padding: "32px",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Page Header */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#111827",
          marginBottom: "24px",
        }}
      >
        View Students
      </h1>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            padding: "12px 20px",
            backgroundColor: "#6b7280",
            color: "#ffffff",
            borderRadius: "6px",
            textDecoration: "none",
          }}
        >
          Back to Dashboard
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

      {/* Student Table */}
      <StudentTable />
    </main>
  );
}
