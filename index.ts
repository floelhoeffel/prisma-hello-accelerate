import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(useAccelerate);
let iteration = 0;
let totalTime = 0;

async function createData() {
  // await prisma.user.create({
  //   data: {
  //     email: "loelhoeffel3@prisma.io",
  //   },
  // });
  // await prisma.user.create({
  //   data: {
  //     email: "loelhoeffel4@prisma.io",
  //   },
  // });
}

async function getData() {
  if (iteration > 100) {
    console.log("Total time", totalTime);
    console.log("Average request time", totalTime / iteration);
    return;
  }
  const startTime = Date.now();

  const { data, info } = await prisma.user
    .count({
      cacheStrategy: { ttl: 3600},
    })
    .withAccelerateInfo();

  console.log("Iteration", iteration);
  console.dir(info);
  const time = Date.now() - startTime;
  totalTime = totalTime + time;
  console.log("Request took:", time, "ms");
  iteration++;
  getData();
}

async function main() {
  getData();
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
