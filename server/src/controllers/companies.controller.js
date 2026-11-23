import prisma from "../lib/prisma.js";

export async function listCompanies(req, res) {
  const { status } = req.query;

  const companies = await prisma.company.findMany({
    where: {
      userId: req.userId,
      ...(status ? { status } : {}),
    },
    orderBy: { name: "asc" },
  });

  res.json(companies);
}

export async function createCompany(req, res) {
  const { name, role, status, interviewDate, notes } = req.body;

  if (!name || !role || !status) {
    return res.status(400).json({ error: "name, role, and status are required" });
  }

  const company = await prisma.company.create({
    data: {
      name,
      role,
      status,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      notes: notes || null,
      userId: req.userId,
    },
  });

  res.status(201).json(company);
}

export async function getCompany(req, res) {
  const company = await prisma.company.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!company) {
    return res.status(404).json({ error: "Company not found" });
  }

  res.json(company);
}

export async function updateCompany(req, res) {
  const existing = await prisma.company.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Company not found" });
  }

  const { name, role, status, interviewDate, notes } = req.body;

  const company = await prisma.company.update({
    where: { id: existing.id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(interviewDate !== undefined
        ? { interviewDate: interviewDate ? new Date(interviewDate) : null }
        : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  });

  res.json(company);
}

export async function deleteCompany(req, res) {
  const existing = await prisma.company.findFirst({
    where: { id: req.params.id, userId: req.userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Company not found" });
  }

  await prisma.company.delete({ where: { id: existing.id } });
  res.status(204).send();
}
