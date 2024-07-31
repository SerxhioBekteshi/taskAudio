import { connect } from "mongoose";

const initialize = async () => {
  // i do not care for storing in this DB
  const DB =
    "mongodb+srv://serxhio:Serxhio12345.@cluster0.tkqmazt.mongodb.net/dietRepo?retryWrites=true&w=majority";
  let connection = await connect(DB, { useNewUrlParser: true });

  if (connection) console.log("Database is connected...");
};
export default { initialize };
