"use client";

import { Bot, Loader2Icon, Send } from "lucide-react";
import { useAllocationStore } from "@/store/allocationStore";

const suggestions = [
  "How many students were allocated to each course?",
  "Which students did not receive their first preference?",
  "Which course had the highest rejection rate?",
  "Show category-wise allocation summary.",
];

export default function AssistantPanel() {
  const assistantAnswer = useAllocationStore((state) => state.assistantAnswer);
  const askAssistant = useAllocationStore((state) => state.askAssistant);
  const ailoading = useAllocationStore((state) => state.ailoading)

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await askAssistant(String(form.get("question")));
  }

  return (
    <section className="rounded-xl border border-line bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-blue-50 p-2 text-brand">
          <Bot size={20} />
        </span>
        <div>
          <h2 className="text-lg font-bold text-ink">AI Assistant</h2>
          <p className="text-sm text-muted">Ask allocation and reporting questions.</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((question) => (
          <button
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted hover:border-brand hover:text-brand"
            key={question}
            onClick={() => askAssistant(question)}
            type="button"
          >
            {question}
          </button>
        ))}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <input
          className="min-w-0 flex-1 rounded-lg border border-line px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          name="question"
          placeholder="Ask a question..."
          required
        />
        <button className="inline-grid h-10 w-10 place-items-center rounded-lg bg-brand text-white" type="submit" aria-label="Ask assistant">
          {ailoading ? <Loader2Icon className="animate-spin" /> : <Send size={16} /> }  
        </button>
      </form>

      {assistantAnswer ? (
        <div className="mt-4 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-sm leading-6 text-ink">{assistantAnswer}</div>
      ) : null}
    </section>
  );
}

