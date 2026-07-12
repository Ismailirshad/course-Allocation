"use client";

import { Save } from "lucide-react";
import { useAllocationStore } from "@/store/allocationStore";

export default function CourseForm() {
  const createCourse = useAllocationStore((state) => state.createCourse);

  async function handleSubmit(event) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    const totalSeats = Number(form.get("totalSeats"));
    const obc = Number(form.get("obc") || 0);
    const sc = Number(form.get("sc") || 0);
    const st = Number(form.get("st") || 0);

    const reservedTotal = obc + sc + st;

    if (reservedTotal > totalSeats) {
      alert("Reserved seats cannot exceed total seats.");
      return;
    }

    try {
      await createCourse({
        name: String(form.get("name")).trim(),
        code: String(form.get("code")).trim().toUpperCase(),
        totalSeats,
        reservedSeats: {
          OBC: obc,
          SC: sc,
          ST: st,
        },
      });

      formElement.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to create course.");
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold text-ink">Add Course</h2>

      <Field
        label="Course Name"
        name="name"
        placeholder="Computer Science"
      />

      <Field
        label="Course Code"
        name="code"
        placeholder="CS101"
      />

      <Field
        label="Total Seats"
        name="totalSeats"
        type="number"
        placeholder="60"
      />

      <div className="grid grid-cols-3 gap-3">
        <Field
          label="OBC"
          name="obc"
          type="number"
          placeholder="10"
        />

        <Field
          label="SC"
          name="sc"
          type="number"
          placeholder="6"
        />

        <Field
          label="ST"
          name="st"
          type="number"
          placeholder="4"
        />
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <Save size={16} />
        Save Course
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
        min={type === "number" ? 0 : undefined}
        className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
      />
    </label>
  );
}