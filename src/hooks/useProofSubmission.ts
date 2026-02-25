import { useState, useEffect, useCallback } from "react";
import { z } from "zod";

const STORAGE_KEY = "prp_final_submission";

const urlSchema = z.string().url("Please enter a valid URL");

export interface ProofLinks {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

export interface StepStatus {
  label: string;
  completed: boolean;
}

const DEFAULT_LINKS: ProofLinks = {
  lovableLink: "",
  githubLink: "",
  deployedLink: "",
};

// Simulated 8 steps — in a real app these would be derived from actual progress
const STEP_LABELS = [
  "Step 1 — Define Problem & User",
  "Step 2 — Draft JD Parser Logic",
  "Step 3 — Build Skill Extraction",
  "Step 4 — Implement Round Mapping",
  "Step 5 — Create Scoring Engine",
  "Step 6 — Build 7-Day Prep Plan",
  "Step 7 — Testing & QA",
  "Step 8 — Ship & Deploy",
];

const STEPS_STORAGE_KEY = "prp_step_completion";

export function useProofSubmission() {
  const [links, setLinks] = useState<ProofLinks>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_LINKS;
  });

  const [steps, setSteps] = useState<boolean[]>(() => {
    try {
      const stored = localStorage.getItem(STEPS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return Array(8).fill(false);
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProofLinks, string>>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(steps));
  }, [steps]);

  const updateLink = useCallback((field: keyof ProofLinks, value: string) => {
    setLinks((prev) => ({ ...prev, [field]: value }));
    // Clear error on edit
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const toggleStep = useCallback((index: number) => {
    setSteps((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }, []);

  const validateLinks = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ProofLinks, string>> = {};
    const fields: (keyof ProofLinks)[] = ["lovableLink", "githubLink", "deployedLink"];
    let valid = true;
    for (const field of fields) {
      const result = urlSchema.safeParse(links[field]);
      if (!result.success) {
        newErrors[field] = result.error.errors[0].message;
        valid = false;
      }
    }
    setErrors(newErrors);
    return valid;
  }, [links]);

  const allLinksProvided = Boolean(links.lovableLink && links.githubLink && links.deployedLink);
  const allLinksValid = allLinksProvided && [links.lovableLink, links.githubLink, links.deployedLink].every((l) => urlSchema.safeParse(l).success);
  const allStepsCompleted = steps.every(Boolean);

  const stepStatuses: StepStatus[] = STEP_LABELS.map((label, i) => ({
    label,
    completed: steps[i],
  }));

  const getExportText = useCallback(() => {
    return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovableLink}
GitHub Repository: ${links.githubLink}
Live Deployment: ${links.deployedLink}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
  }, [links]);

  return {
    links,
    errors,
    steps: stepStatuses,
    updateLink,
    toggleStep,
    validateLinks,
    allLinksProvided,
    allLinksValid,
    allStepsCompleted,
    getExportText,
  };
}
