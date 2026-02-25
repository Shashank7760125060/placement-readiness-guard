import { useProofSubmission } from "@/hooks/useProofSubmission";
import { useTestChecklist } from "@/hooks/useTestChecklist";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Link2,
  Github,
  Globe,
  Copy,
  Trophy,
  ArrowLeft,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

const Proof = () => {
  const {
    links,
    errors,
    steps,
    updateLink,
    toggleStep,
    validateLinks,
    allLinksValid,
    allStepsCompleted,
    getExportText,
  } = useProofSubmission();

  const { allPassed: allTestsPassed } = useTestChecklist();

  const isShipped = allStepsCompleted && allTestsPassed && allLinksValid;

  const handleCopyExport = () => {
    if (!validateLinks()) {
      toast({ title: "Invalid URLs", description: "Please fix the URL errors before exporting.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(getExportText());
    toast({ title: "Copied!", description: "Final submission copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span className="inline-flex items-center gap-1"><ArrowLeft className="h-3.5 w-3.5" /> Back to Home</span>
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Proof & Submission
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete all steps, pass all tests, and provide your project links to ship.
          </p>
        </div>

        {/* Status Badge */}
        <div className={`mb-8 rounded-xl border-2 p-5 transition-colors ${isShipped ? "border-success bg-success/5" : "border-warning bg-warning/5"}`}>
          <div className="flex items-center gap-3">
            {isShipped ? <Trophy className="h-7 w-7 text-success" /> : <AlertTriangle className="h-7 w-7 text-warning" />}
            <div>
              <p className="text-lg font-bold text-foreground">
                Status: {isShipped ? "Shipped ✅" : "In Progress"}
              </p>
              {!isShipped && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {!allStepsCompleted && "Complete all 8 steps. "}
                  {!allTestsPassed && "Pass all 10 tests. "}
                  {!allLinksValid && "Provide all 3 valid links."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Shipped Message */}
        {isShipped && (
          <div className="mb-8 rounded-xl border border-success/30 bg-success/5 p-6 text-center">
            <Sparkles className="h-8 w-8 text-success mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">You built a real product.</p>
            <p className="text-muted-foreground mt-1">Not a tutorial. Not a clone.</p>
            <p className="text-muted-foreground">A structured tool that solves a real problem.</p>
            <p className="text-sm font-bold text-success mt-3">This is your proof of work.</p>
          </div>
        )}

        {/* Section A: Step Completion */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Step Completion Overview</h2>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={index}
                onClick={() => toggleStep(index)}
                className={`group cursor-pointer rounded-lg border p-3.5 transition-all ${
                  step.completed
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                  )}
                  <span className={`font-medium text-sm ${step.completed ? "text-success line-through" : "text-foreground"}`}>
                    {step.label}
                  </span>
                  <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                    step.completed ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}>
                    {step.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section B: Artifact Inputs */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-4">Artifact Links</h2>
          <div className="space-y-4">
            {([
              { key: "lovableLink" as const, label: "Lovable Project Link", icon: Link2, placeholder: "https://lovable.dev/projects/..." },
              { key: "githubLink" as const, label: "GitHub Repository Link", icon: Github, placeholder: "https://github.com/..." },
              { key: "deployedLink" as const, label: "Deployed URL", icon: Globe, placeholder: "https://your-app.lovable.app" },
            ]).map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-1.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </label>
                <input
                  type="url"
                  value={links[key]}
                  onChange={(e) => updateLink(key, e.target.value)}
                  placeholder={placeholder}
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors ${
                    errors[key] ? "border-destructive" : "border-input"
                  }`}
                />
                {errors[key] && (
                  <p className="text-xs text-destructive mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Copy Export Button */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleCopyExport}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
          >
            <Copy className="h-5 w-5" />
            Copy Final Submission
          </button>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/prp/07-test" className="hover:text-foreground transition-colors">
              → Test Checklist
            </Link>
            <Link to="/prp/08-ship" className="hover:text-foreground transition-colors">
              → Ship Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proof;
