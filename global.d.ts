declare global {
  var _mongoClientPromise: Promise<MongoClient>;
  var mongoose: {
    conn: Promise<Mongoose> | null;
    promise: Promise<Mongoose> | null;
  };
}

export {};
