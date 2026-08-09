const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const demoPassword = "DemoPass123!";

async function upsertUser({ name, email, role }) {
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  return prisma.user.upsert({
    where: { email },
    update: { name, role, isActive: true, passwordHash },
    create: {
      name,
      email,
      role,
      isActive: true,
      passwordHash,
    },
  });
}

async function main() {
  const admin = await upsertUser({
    name: "Demo Administrator",
    email: "admin@freelancehub.demo",
    role: "ADMIN",
  });
  const client = await upsertUser({
    name: "Demo Client",
    email: "client@freelancehub.demo",
    role: "CLIENT",
  });
  const freelancer = await upsertUser({
    name: "Demo Freelancer",
    email: "freelancer@freelancehub.demo",
    role: "FREELANCER",
  });

  const oldProjects = await prisma.project.findMany({
    where: { clientId: client.id, title: { startsWith: "[Demo]" } },
    select: { id: true },
  });
  const oldProjectIds = oldProjects.map(({ id }) => id);
  if (oldProjectIds.length) {
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { projectId: { in: oldProjectIds } } }),
      prisma.milestone.deleteMany({ where: { projectId: { in: oldProjectIds } } }),
      prisma.bid.deleteMany({ where: { projectId: { in: oldProjectIds } } }),
      prisma.project.deleteMany({ where: { id: { in: oldProjectIds } } }),
    ]);
  }

  await prisma.project.create({
    data: {
      clientId: client.id,
      title: "[Demo] Marketing website",
      description: "Design and build a responsive marketing website for a local business.",
      category: "Web Development",
      budgetMin: 1800,
      budgetMax: 3200,
      status: "OPEN",
      bids: {
        create: {
          freelancerId: freelancer.id,
          proposal: "I will deliver a responsive, accessible website with reusable components.",
          bidAmount: 2400,
          estimatedDays: 14,
        },
      },
    },
  });

  await prisma.project.create({
    data: {
      clientId: client.id,
      title: "[Demo] Mobile app prototype",
      description: "Create an interactive prototype for a service marketplace mobile app.",
      category: "UI/UX Design",
      budgetMin: 1200,
      budgetMax: 2200,
      status: "IN_PROGRESS",
      bids: {
        create: {
          freelancerId: freelancer.id,
          proposal: "I will produce the core flows, a component library, and a tested prototype.",
          bidAmount: 1750,
          estimatedDays: 10,
          status: "ACCEPTED",
        },
      },
      milestones: {
        create: [
          {
            title: "User flows",
            description: "Map the primary client and freelancer journeys.",
            dueDate: new Date("2026-08-05T12:00:00Z"),
            status: "APPROVED",
          },
          {
            title: "Interactive prototype",
            description: "Create and submit the high-fidelity interactive prototype.",
            dueDate: new Date("2026-08-15T12:00:00Z"),
            status: "IN_PROGRESS",
          },
        ],
      },
    },
  });

  console.log("Demo data is ready.");
  console.log(`Admin: admin@freelancehub.demo / ${demoPassword}`);
  console.log(`Client: client@freelancehub.demo / ${demoPassword}`);
  console.log(`Freelancer: freelancer@freelancehub.demo / ${demoPassword}`);
  console.log(`Admin user id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
