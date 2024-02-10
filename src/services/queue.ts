import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10); // Default to 6379 if not set
const redisHost = process.env.REDIS_HOST || "localhost";

export const redisConnection = new Redis(redisPort, redisHost);

const uploadDoneQueue = new Queue("build-queue");

export const startTheDeploy = async (id: string) => {
  await uploadDoneQueue.add(`build-queue:${id}`, id);
  redisConnection.hset("status", id, "uploaded");
  return redisConnection.hgetall("status");
};
