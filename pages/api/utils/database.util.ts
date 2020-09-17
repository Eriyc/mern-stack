import mongoose from "mongoose";

const getDatabase = async () => {
  if (mongoose.connection.host) {
    console.log(
      "Connected to database",
      mongoose.connection.host,
      mongoose.connection.name,
      mongoose.connection.db.databaseName
    );
    return mongoose;
  } else {
    return await mongoose
      .connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongo) => {
        console.log("Connected to database", mongo.connection.host);
        return mongo;
      });
  }
};

export { getDatabase };
