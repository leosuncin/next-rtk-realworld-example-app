import mongoose from 'mongoose';

/**
 * Connect to MongoDB.
 *
 * @param {String} mongoUri Connection URI
 * @returns Promise<typeof mongoose>
 */
export function connectDB(mongoUri: string): Promise<typeof mongoose> | void {
  const isConnected =
    mongoose.connection.readyState === mongoose.STATES.connected;

  if (isConnected) return;

  return mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    // Buffering means mongoose will queue up operations if it gets
    // disconnected from MongoDB and send them when it reconnects.
    // With serverless, better to fail fast if not connected.
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0, // And MongoDB driver buffering
  });
}

/**
 * Disconnect from MongoDB.
 *
 * @returns Promise<void>
 */
export function disconnectDB(): Promise<void> | void {
  const isDisconnected =
    mongoose.connection.readyState === mongoose.STATES.disconnected;

  if (isDisconnected) return;

  return mongoose.connection.close();
}
