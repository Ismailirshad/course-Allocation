"use client";

import { create } from "zustand";
import { api } from "@/lib/api";

export const useAllocationStore = create((set, get) => ({
  loading: false,
  error: "",
  ailoading:false,
  courses: [],
  students: [],
  dashboard: null,

  assistantAnswer: "",

  fetchInitialData: async () => {
    set({ loading: true, error: "" });

    try {
      const [coursesRes, studentsRes, dashboardRes] = await Promise.all([
        api.get("/courses"),
        api.get("/students"),
        api.get("/allocation/dashboard"),
      ]);

      set({
        courses: coursesRes.data.courses,
        students: studentsRes.data.students,
        dashboard: dashboardRes.data,
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to load dashboard data.",
      });
    }
  },

  createCourse: async (payload) => {
    set({ loading: true, error: "" });

    try {
      await api.post("/courses", payload);

      await get().fetchInitialData();
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to create course.",
      });
    }
  },

  createStudent: async (payload) => {
    set({ loading: true, error: "" });

    try {
      await api.post("/students", payload);

      await get().fetchInitialData();
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Failed to register student.",
      });
    }
  },

  runAllocation: async () => {
    set({ loading: true, error: "" });

    try {
      await api.post("/allocation/run");

      // Refresh dashboard after allocation
      await get().fetchInitialData();
    } catch (error) {
      set({
        loading: false,
        error:
          error.response?.data?.message || "Allocation failed.",
      });
    }
  },

  askAssistant: async (question) => {
    set({
      ailoading: true,
      error: "",
      assistantAnswer: "",
    });

    try {
      const res = await api.post("/assistant/ask", {
        question,
      });

      set({
        assistantAnswer: res.data.answer,
        ailoading: false,
      });
    } catch (error) {
      set({
        ailoading: false,
        error:
          error.response?.data?.message || "Assistant failed.",
      });
    }
  },
}));