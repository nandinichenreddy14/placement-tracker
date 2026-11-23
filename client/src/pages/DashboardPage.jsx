import { useEffect, useState } from "react";
import { Code2, CircleCheck, CircleDot, Flame, Building2, Trophy } from "lucide-react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import DifficultyDonutChart from "../components/DifficultyDonutChart.jsx";
import TopicBarChart from "../components/TopicBarChart.jsx";
import StatusPipeline from "../components/StatusPipeline.jsx";
import RecentActivity from "../components/RecentActivity.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function sumCounts(rows) {
  return rows.reduce((total, row) => total + row.count, 0);
}

function countFor(rows, key, value) {
  return rows.find((row) => row[key] === value)?.count ?? 0;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function nameFromEmail(email) {
  if (!email) return "";
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get("/dashboard"), api.get("/problems")])
      .then(([dashboardRes, problemsRes]) => {
        setData(dashboardRes.data);
        setProblems(problemsRes.data);
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const recent = [...problems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${nameFromEmail(user?.email)}`}
        description="Here's how your placement prep is going."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={Code2}
              label="Total Problems"
              value={sumCounts(data.problemsByDifficulty)}
              subtext="Across all platforms"
            />
            <StatCard
              icon={CircleCheck}
              label="Easy"
              value={countFor(data.problemsByDifficulty, "difficulty", "EASY")}
              accentClass="bg-easy-soft text-easy"
              subtext="Problems solved"
            />
            <StatCard
              icon={CircleDot}
              label="Medium"
              value={countFor(data.problemsByDifficulty, "difficulty", "MEDIUM")}
              accentClass="bg-medium-soft text-medium"
              subtext="Problems solved"
            />
            <StatCard
              icon={Flame}
              label="Hard"
              value={countFor(data.problemsByDifficulty, "difficulty", "HARD")}
              accentClass="bg-hard-soft text-hard"
              subtext="Problems solved"
            />
            <StatCard
              icon={Building2}
              label="Companies Applied"
              value={
                sumCounts(data.companiesByStatus) -
                countFor(data.companiesByStatus, "status", "WISHLIST")
              }
              subtext="Beyond wishlist"
            />
            <StatCard
              icon={Trophy}
              label="Offers"
              value={countFor(data.companiesByStatus, "status", "OFFER")}
              accentClass="bg-offer-soft text-offer"
              subtext="Offers received"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Problems by Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <DifficultyDonutChart data={data.problemsByDifficulty} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Problems by Topic</CardTitle>
              </CardHeader>
              <CardContent>
                <TopicBarChart data={data.problemsByTopic} />
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Company Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusPipeline data={data.companiesByStatus} />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity problems={recent} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
