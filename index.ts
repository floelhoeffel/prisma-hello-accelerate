import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(useAccelerate);
let iteration = 0;
let totalTime = 0;

async function createData() {
  await prisma.user.create({
    data: {
      email: "loelhoeffel5@prisma.io",
    },
  });
  await prisma.user.create({
    data: {
      email: "loelhoeffel6@prisma.io",
    },
  });
}

async function getData() {
  if (iteration > 100) {
    console.log("Total time", totalTime);
    console.log("Average request time", totalTime / iteration);
    return;
  }
  const startTime = Date.now();

  const { data, info } = await prisma.user
    .findMany({
      cacheStrategy: { ttl: 5, swr:5},
    })
    .withAccelerateInfo();

  console.log("---- Iteration", iteration);
  console.dir(data);
  console.dir(info);
  const time = Date.now() - startTime;
  totalTime = totalTime + time;
  console.log("Request took:", time, "ms");
  iteration++;
  getData();
}

async function main() {
  getData();
  // createData()
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
