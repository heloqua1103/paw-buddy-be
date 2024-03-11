import redis, { createClient } from "redis";

let client = {},
  statusConnectRedis = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnect",
    ERROR: "error",
  };
const handleEventConnection = ({ connectionRedis }) => {
  if (!connectionRedis) return;
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log("Redis connected");
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log("Redis end");
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log("Redis reconnect");
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log("Redis error", err);
  });
};

const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceRedis = instanceRedis;
  handleEventConnection({
    connectionRedis: instanceRedis,
  });
};

const getRedis = () => client;

const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
