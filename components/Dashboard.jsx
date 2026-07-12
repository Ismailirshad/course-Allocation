"use client";

import { Bot, GraduationCap, Play, RefreshCw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useAllocationStore } from "@/store/allocationStore";
import AssistantPanel from "./AssistantPanel";
import StudentForm from "./StudentForm";
import CourseForm from "./CourseForm";
import WelcomeCard from "./welcomeCard";


export default function Dashboard() {
  const { dashboard, loading, error, fetchInitialData, runAllocation } =
    useAllocationStore();
  const [activeForm, setActiveForm] = useState("student");

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (loading || dashboard === null) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <RefreshCw className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className=" top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              AI Powered
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              Course Allocation System
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Intelligent seat allocation with AI insights and real-time
              analytics
            </p>
          </div>

          {/* Right */}
          <button
            onClick={runAllocation}
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95"
          >
            <Play
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            />
            Run Allocation
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {dashboard?.run?.allocatedCount === 0 ? (
            <WelcomeCard studentCount={dashboard?.studentCount || 0}
              courseCount={dashboard?.courseCount || 0}
              onRun={runAllocation} />
          ) : (<> <div className="grid gap-4 md:grid-cols-3">
            <Metric
              label="Total Students"
              value={dashboard?.run?.totalStudents || 0}
              icon={<Users size={20} />}
            />
            <Metric
              label="Allocated"
              value={dashboard?.run?.allocatedCount || 0}
              icon={<GraduationCap size={20} />}
            />
            <Metric
              label="Unallocated"
              value={dashboard?.run?.unallocatedCount || 0}
              icon={<Bot size={20} />}
            />
          </div>

            <AllocatedTable />
            <DashboardStats />
          </>
          )}
        </div>

        <aside className="space-y-6">
          {dashboard?.run?.allocatedCount === 0 ? "" : <AssistantPanel />}
          <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveForm("student")}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${activeForm === "student" ? "bg-white shadow-sm" : "text-muted"}`}
              >
                Student
              </button>
              <button
                onClick={() => setActiveForm("course")}
                className={`rounded-md px-3 py-2 text-sm font-semibold ${activeForm === "course" ? "bg-white shadow-sm" : "text-muted"}`}
              >
                Course
              </button>
            </div>

            {activeForm === "student" ? <StudentForm /> : <CourseForm />}
          </section>
        </aside>
      </section>

      {loading ? (
        <div className="fixed bottom-5 right-5 rounded-lg bg-ink px-4 py-3 text-sm font-semibold text-white">
          Working...
        </div>
      ) : null}
    </main>
  );
}

function Metric({ label, value, icon }) {
  return (
    <article className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className="rounded-lg bg-blue-50 p-2 text-brand">{icon}</span>
      </div>
      <p className="mt-4 text-3xl font-bold text-ink">{value}</p>
    </article>
  );
}

function AllocatedTable() {
  const dashboard = useAllocationStore((state) => state.dashboard);

  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <h2 className="text-lg font-bold">Allocated Students</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-muted">
            <tr>
              <th className="py-3">Student</th>
              <th>Category</th>
              <th>Marks</th>
              <th>Course</th>
              <th>Preference</th>
              <th>Seat Pool</th>
            </tr>
          </thead>
          <tbody>
            {(dashboard?.allocatedStudents || []).map((student) => (
              <tr className="border-b border-slate-100" key={student.studentId}>
                <td className="py-3 font-semibold">{student.name}</td>
                <td>{student.category}</td>
                <td>{student.marks}</td>
                <td>{student.course}</td>
                <td>{student.allocatedPreference}</td>
                <td>{student.seatPool}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DashboardStats() {
  const dashboard = useAllocationStore((state) => state.dashboard);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Available Seats</h2>
        <div className="mt-4 space-y-3">
          {(dashboard?.availableSeats || []).map((item) => (
            <div
              className="rounded-lg border border-line p-4"
              key={item.course}
            >
              <p className="font-semibold">{item.course}</p>
              <p className="mt-1 text-sm text-muted">
                Open {item.open} · OBC {item.OBC} · SC {item.SC} · ST {item.ST}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold">Course Statistics</h2>
        <div className="mt-4 space-y-3">
          {(dashboard?.courseStatistics || []).map((item) => (
            <div
              className="rounded-lg border border-line p-4"
              key={item.course}
            >
              <div className="flex justify-between gap-4">
                <p className="font-semibold">{item.course}</p>
                <p className="text-sm font-semibold text-brand">
                  {item.rejectionRate}% rejected
                </p>
              </div>
              <p className="mt-1 text-sm text-muted">
                Allocated {item.allocated}/{item.totalSeats} · Requests{" "}
                {item.requestCount}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
