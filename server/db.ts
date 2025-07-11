import mongoose from "mongoose";

export default async function () {
  try {
    const conn = await mongoose.connect(`${process.env.DB_URL}`, {
      autoIndex: process.env.NODE_ENV === "development" // Auto-index in dev only
    });

    console.log("DataBase Connected Successfully on port " + conn.connection.host);
  } catch (error) {
    if (process.env.NODE_ENV === "development") console.log(error);
    else console.log("Database connection failed. Exiting!");
    process.exit(1);
  }
};
