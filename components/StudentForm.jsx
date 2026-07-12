"use client";

import { UserPlus } from "lucide-react";
import { useAllocationStore } from "@/store/allocationStore";

const categories = ["General", "OBC", "SC", "ST"];

export default function StudentForm() {
  const courses = useAllocationStore((state) => state.courses);
  const createStudent = useAllocationStore((state) => state.createStudent);

  async function handleSubmit(event) {
    event.preventDefault();

const formElement = event.currentTarget;
const form = new FormData(formElement);

    const preference1 = form.get("preference1");
    const preference2 = form.get("preference2");
    const preference3 = form.get("preference3");

    // Prevent duplicate course selections
    const selectedPreferences = [
      preference1,
      preference2,
      preference3,
    ].filter(Boolean);

    if (new Set(selectedPreferences).size !== selectedPreferences.length) {
      alert("Please select different courses for each preference.");
      return;
    }

    try {
      await createStudent({
        studentId: String(form.get("studentId")),
        name: String(form.get("name")),
        marks: Number(form.get("marks")),
        category: String(form.get("category")),
        applicationDate: form.get("applicationDate"),

        preference1,
        preference2: preference2 || null,
        preference3: preference3 || null,
      });

      formElement.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to register student.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-ink">Register Student</h2>

      <Field
        label="Student ID"
        name="studentId"
        placeholder="STU-1001"
      />

      <Field
        label="Name"
        name="name"
        placeholder="Aarav Sharma"
      />

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Marks"
          name="marks"
          type="number"
          placeholder="92"
        />

        <label className="block">
          <span className="text-sm font-semibold text-ink">
            Category
          </span>

          <select
            name="category"
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
            defaultValue="General"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Field
        label="Application Date"
        name="applicationDate"
        type="date"
      />

      {[1, 2, 3].map((priority) => (
        <label className="block" key={priority}>
          <span className="text-sm font-semibold text-ink">
            Preference {priority}
          </span>

          <select
            name={`preference${priority}`}
            required={priority === 1}
            defaultValue=""
            className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select Course</option>

            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </label>
      ))}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <UserPlus size={16} />
        Register Student
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink">
        {label}
      </span>

      <input
        required
        type={type}
        name={name}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}