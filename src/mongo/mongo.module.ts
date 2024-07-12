import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DATABASE_URL, // Replace with your MongoDB connection string
        
        onConnectionCreate: (connection) => {
            
          connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
          });

          connection.on('connected', () => {
            console.log('Connected to MongoDB');
          });

          connection.on('disconnected', () => {
            console.log('Disconnected from MongoDB');
          });

          return connection;
        },
      }),
    }),
  ],
})
export class MongoModule {}
