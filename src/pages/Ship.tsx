import { useTestChecklist } from "@/hooks/useTestChecklist";
import { Navigate, Link } from "react-router-dom";
import { Rocket, ArrowLeft } from "lucide-react";

const Ship = () => {
  const { allPassed } = useTestChecklist();

  if (!allPassed) {
    return <Navigate to="/prp/07-test" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-lg px-4">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
          <Rocket className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to Ship 🚀
        </h1>
        <p className="mt-3 text-muted-foreground">
          All 10 pre-ship tests have passed. Your Placement Readiness Platform is verified and ready for deployment.
        </p>
        <div className="mt-8">
          <Link
            to="/prp/07-test"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to checklist
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Ship;
