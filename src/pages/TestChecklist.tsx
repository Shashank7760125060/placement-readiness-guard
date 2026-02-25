import { useTestChecklist } from "@/hooks/useTestChecklist";
import { CheckCircle2, Circle, AlertTriangle, RotateCcw, Info, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const TestChecklist = () => {
  const { tests, toggle, reset, passedCount, total, allPassed } = useTestChecklist();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Pre-Ship Test Checklist
          </h1>
          <p className="mt-2 text-muted-foreground">
            Complete all tests before shipping. Results persist in localStorage.
          </p>
        </div>

        {/* Summary Card */}
        <div
          className={`mb-8 rounded-xl border-2 p-6 transition-colors ${
            allPassed
              ? "border-success bg-success/5"
              : "border-warning bg-warning/5"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {allPassed ? (
                <ShieldCheck className="h-8 w-8 text-success" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-warning" />
              )}
              <div>
                <p className="text-2xl font-bold text-foreground">
                  Tests Passed: {passedCount} / {total}
                </p>
                {!allPassed && (
                  <p className="text-sm font-medium text-warning mt-0.5">
                    Fix issues before shipping.
                  </p>
                )}
                {allPassed && (
                  <p className="text-sm font-medium text-success mt-0.5">
                    All tests passed — ready to ship!
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              Reset checklist
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(passedCount / total) * 100}%` }}
          />
        </div>

        {/* Test Items */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={test.id}
              onClick={() => toggle(test.id)}
              className={`group cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                test.checked
                  ? "border-success/30 bg-success/5"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">
                  {test.checked ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`font-medium transition-colors ${
                      test.checked ? "text-success line-through" : "text-foreground"
                    }`}
                  >
                    <span className="text-muted-foreground mr-2 text-sm">#{index + 1}</span>
                    {test.label}
                  </p>
                  <div className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <span>{test.hint}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ship Link */}
        <div className="mt-10 text-center">
          {allPassed ? (
            <Link
              to="/prp/08-ship"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              <ShieldCheck className="h-5 w-5" />
              Proceed to Ship
            </Link>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-xl bg-muted px-8 py-3 text-sm font-medium text-muted-foreground cursor-not-allowed">
              <AlertTriangle className="h-5 w-5" />
              Ship locked — pass all tests first
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestChecklist;
