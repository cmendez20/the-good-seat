import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";

const app = new Hono();

// --- Middleware ---
// CORS for development (adjust for production)
app.use(
  "/api/*",
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com" // Replace with your actual frontend domain
        : "http://localhost:5173", // Your React dev server
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // If you're sending cookies/auth headers
  })
);

// Simple root route for testing
app.get("/", c => {
  return c.text("Hono API is running!");
});

app.get("/api/screens", async c => {
  const screens = await db
    .select({
      name: schema.screens.name,
      screenType: schema.screens.screenType,
    })
    .from(schema.screens);

  return c.json(screens);
});

// --- Start the Server ---
const port = parseInt(process.env.PORT || "3000");
serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(
      `CORS enabled for: ${
        process.env.NODE_ENV === "production"
          ? "https://your-frontend-domain.com"
          : "http://localhost:5173"
      }`
    );
  }
);
