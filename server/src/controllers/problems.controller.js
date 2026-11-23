import prisma from "../lib/prisma.js";

export async function listProblems(req, res) {
  const { topic, difficulty, status } = req.query;

  const problems = await prisma.problem.findMany({
    where: {
      userId: req.userId,
      ...(topic ? { topic } : {}),
      ...(difficulty ? { difficulty } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { date: "desc" },
  });

  res.json(problems);
}

export async function createProblem(req, res) {
  const { title, platform, difficulty, topic, status, link, notes, date } = req.body;

  if (!title || !platform || !difficulty || !topic || !status) {
    return res.status(400).json({
      error: "title, platform, difficulty, topic, and status are required",
    });
  }

  const problem = await prisma.problem.create({
    data: {
      title,
      platform,
      difficulty,
      topic,
      status,
      link: link || null,
      notes: notes || null,
      ...(date ? { date: new Date(date) } : {}),
      userId: req.userId,
    },
  });

  res.status(201).json(problem);
}

export async function getProblem(req, res) {
  const problem = await prisma.problem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!problem) {
    return res.status(404).json({ error: "Problem not found" });
  }

  res.json(problem);
}

export async function updateProblem(req, res) {
  const existing = await prisma.problem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Problem not found" });
  }

  const { title, platform, difficulty, topic, status, link, notes, date } = req.body;

  const problem = await prisma.problem.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(platform !== undefined ? { platform } : {}),
      ...(difficulty !== undefined ? { difficulty } : {}),
      ...(topic !== undefined ? { topic } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(link !== undefined ? { link } : {}),
      ...(notes !== undefined ? { notes } : {}),
      ...(date !== undefined ? { date: new Date(date) } : {}),
    },
  });

  res.json(problem);
}

export async function deleteProblem(req, res) {
  const existing = await prisma.problem.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Problem not found" });
  }

  await prisma.problem.delete({ where: { id: existing.id } });
  res.status(204).send();
}
