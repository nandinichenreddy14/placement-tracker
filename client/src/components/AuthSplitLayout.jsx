import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const FEATURES = [
  "Track every problem you solve, by topic and difficulty",
  "Keep tabs on every company in your pipeline",
  "See your progress at a glance on one dashboard",
];

function AuthSplitLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 font-bold">
            P
          </div>
          <span className="text-lg font-semibold">Placement Tracker</span>
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Track your prep.
            <br />
            Land the offer.
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-indigo-100">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-white" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-indigo-200">
          © {new Date().getFullYear()} Placement Prep Tracker
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export default AuthSplitLayout;
