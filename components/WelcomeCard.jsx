import { GraduationCap, Play } from "lucide-react";

export default function WelcomeCard({ studentCount, courseCount, onRun }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <GraduationCap className="text-blue-600" size={30} />
        </div>

        <h2 className="text-3xl font-bold text-slate-900">
          Ready to Run Course Allocation
        </h2>

        <p className="mt-3 text-slate-500">
          Register students and courses, then generate seat allocations based on
          merit, reservation policy, and student preferences.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Students Registered</p>

            <p className="mt-2 text-3xl font-bold">
              {studentCount}
            </p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Courses Available</p>

            <p className="mt-2 text-3xl font-bold">
              {courseCount}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
          Allocation has not been run yet.
        </div>

        <button
          onClick={onRun}
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white transition hover:scale-105"
        >
          <Play size={18} />
          Run Allocation
        </button>
      </div>
    </section>
  );
}