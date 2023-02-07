import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(useAccelerate);

async function main() {
  const startTime = Date.now();

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

  const { data, info } = await prisma.user
    .count({
      cacheStrategy: { swr: 60, ttl: 60 },
    })
    .withAccelerateInfo();

  console.dir(info);
  console.log("Request took:", Date.now() - startTime, "ms");
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
