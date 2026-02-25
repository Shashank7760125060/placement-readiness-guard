import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "prp-test-checklist";

export interface TestItem {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
}

const DEFAULT_TESTS: TestItem[] = [
  { id: "jd-validation", label: "JD required validation works", hint: "Try submitting an empty JD field and verify a validation error appears.", checked: false },
  { id: "short-jd", label: "Short JD warning shows for <200 chars", hint: "Paste a JD shorter than 200 characters and verify a warning message is displayed.", checked: false },
  { id: "skills-extraction", label: "Skills extraction groups correctly", hint: "Submit a JD with multiple skill categories and verify they are grouped properly.", checked: false },
  { id: "round-mapping", label: "Round mapping changes based on company + skills", hint: "Change company or skills and verify the interview rounds update accordingly.", checked: false },
  { id: "score-calc", label: "Score calculation is deterministic", hint: "Run the same inputs twice and verify the score is identical both times.", checked: false },
  { id: "skill-toggles", label: "Skill toggles update score live", hint: "Toggle skills on/off and verify the score updates immediately without page reload.", checked: false },
  { id: "persist-refresh", label: "Changes persist after refresh", hint: "Make changes, refresh the browser, and verify all data is still present.", checked: false },
  { id: "history-save", label: "History saves and loads correctly", hint: "Create an analysis, navigate away, return, and verify history entries load.", checked: false },
  { id: "export-buttons", label: "Export buttons copy the correct content", hint: "Click each export/copy button and paste the result to verify correctness.", checked: false },
  { id: "no-console-errors", label: "No console errors on core pages", hint: "Open DevTools Console and navigate through all /prp pages — verify zero errors.", checked: false },
];

export function useTestChecklist() {
  const [tests, setTests] = useState<TestItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_TESTS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }, [tests]);

  const toggle = useCallback((id: string) => {
    setTests((prev) => prev.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t)));
  }, []);

  const reset = useCallback(() => {
    setTests(DEFAULT_TESTS);
  }, []);

  const passedCount = tests.filter((t) => t.checked).length;
  const allPassed = passedCount === tests.length;

  return { tests, toggle, reset, passedCount, total: tests.length, allPassed };
}
