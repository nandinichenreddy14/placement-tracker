import prisma from "../lib/prisma.js";

export async function getDashboard(req, res) {
  const userId = req.userId;

  const [byDifficulty, byTopic, byCompanyStatus] = await Promise.all([
    prisma.problem.groupBy({
      by: ["difficulty"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.problem.groupBy({
      by: ["topic"],
      where: { userId },
      _count: { _all: true },
    }),
    prisma.company.groupBy({
      by: ["status"],
      where: { userId },
      _count: { _all: true },
    }),
  ]);

  res.json({
    problemsByDifficulty: byDifficulty.map((row) => ({
      difficulty: row.difficulty,
      count: row._count._all,
    })),
    problemsByTopic: byTopic.map((row) => ({
      topic: row.topic,
      count: row._count._all,
    })),
    companiesByStatus: byCompanyStatus.map((row) => ({
      status: row.status,
      count: row._count._all,
    })),
  });
}
