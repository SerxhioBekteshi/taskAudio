import { connect } from "mongoose";

const initialize = async () => {
  // i do not care for storing in this DB
  const DB = "connectionString";
  let connection = await connect(DB, { useNewUrlParser: true });

  if (connection) console.log("Database is connected...");
};
export default { initialize };
