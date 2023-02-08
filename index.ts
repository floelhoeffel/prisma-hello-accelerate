import { PrismaClient } from "@prisma/client";
import useAccelerate from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(useAccelerate);
let iteration = 1;
let totalTime = 0;
let cacheStatus = {
  ttl: {
    count: 0,
    time: 0,
  },
  swr: {
    count: 0,
    time: 0,
  },
  miss: {
    count: 0,
    time: 0,
  },
  none: {
    count: 0,
    time: 0,
  },
};

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
    console.log("- - - - Done - - - -");
    console.log("Total time", totalTime);
    console.log("Average request time", totalTime / iteration);
    cacheStatus.ttl.time = cacheStatus.ttl.time / cacheStatus.ttl.count;
    cacheStatus.swr.time = cacheStatus.swr.time / cacheStatus.swr.count;
    cacheStatus.miss.time = cacheStatus.miss.time / cacheStatus.miss.count;
    cacheStatus.none.time = cacheStatus.none.time / cacheStatus.none.count;
    console.log(cacheStatus);
    return;
  }
  const startTime = Date.now();

  const { data, info } = await prisma.user
    .findMany({
      cacheStrategy: { ttl: 30, swr: 30 },
    })
    .withAccelerateInfo();
  if (info) {
    console.log("---- Iteration", iteration);
    console.dir(data);
    console.dir(info);
    const time = Date.now() - startTime;
    cacheStatus[info.cacheStatus].count++;
    cacheStatus[info.cacheStatus].time += time;
    totalTime = totalTime + time;
    console.log("Request took:", time, "ms");
  }
  iteration++;
  getData();
}

async function main() {
  getData();
  // createData();
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
