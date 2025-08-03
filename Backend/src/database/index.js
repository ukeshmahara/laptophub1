import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const db = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");

    // Import all models to ensure they are registered
    await import("../models/index.js");
    console.log("✅ Models imported successfully.");

    // Determine sync strategy based on environment
    const syncOptions = {};
    
    if (process.env.NODE_ENV === 'test') {
      // For testing, use force: true to ensure clean state
      syncOptions.force = true;
      console.log("🧪 Test environment: Using force sync (will drop tables)");
    } else if (process.env.NODE_ENV === 'development') {
      // For development, use alter: true to preserve data but allow schema changes
      syncOptions.alter = true;
      console.log("🔧 Development environment: Using alter sync (preserves data)");
    } else {
      // For production, use safe sync (no destructive changes)
      console.log("🚀 Production environment: Using safe sync (no destructive changes)");
    }

    // Sync all models with database
    await sequelize.sync(syncOptions);
    console.log("✅ Database models synchronized successfully.");
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if database connection fails
  }
};