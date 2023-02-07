import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(useAccelerate);

let startTime = Date.now();;

async function main() {
  startTime = Date.now();
  await prisma.user.findMany({
    cacheStrategy: {swr: 60, ttl: 60}
    
  }).withAccelerateInfo();

  startTime = Date.now();
  const {data, info } = await prisma.user.findMany({
    cacheStrategy: {swr: 60, ttl: 60}
    
  }).withAccelerateInfo();

  // const users = await prisma.user.findMany({

  //   cacheStrategy: {swr: 60, ttl: 60}
    
  // })

  console.dir(info)

  //   const newUser = await prisma.user.create({
  //     data: {
  //       name: "Alice",
  //       email: "alice@prisma.io",
  //     },
  //   });
}

main()
  .then(async () => {
    console.log("Request took:", Date.now() - startTime, "ms");

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
