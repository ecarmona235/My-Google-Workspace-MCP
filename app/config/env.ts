import dotenv from "dotenv";
dotenv.config();
import { z } from "zod";
import { Logger } from "@/app/utils/logger";

const logger = new Logger("Config:Env");

// Schema for environment variables
const envSchema = z.object({
  REDIS_URL: z.string(),
  GOOGLE_API_KEY: z.string(),
  GOOGLE_CLIENT_ID: z.string(), // used for google auth
});

// Function to validate environment variables
const validateEnv = () => {
  try {
    logger.info("Validating environment variables");
    const env = {
      REDIS_URL: process.env.REDIS_URL,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    };
    const parsed = envSchema.parse(env);
    logger.info("Environment variables validated successfully");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join("."));
      logger.error("Invalid environment variables", { error: { missingVars } });
      throw new Error(
        `❌ Invalid environment variables: ${missingVars.join(
          ", "
        )}. Please check your .env file`
      );
    }
    throw error;
  }
};

export const env = validateEnv();
