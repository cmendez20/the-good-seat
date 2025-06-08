import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

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

// Example API endpoint (you'll replace this with real routes)
app.get("/api/hello", c => {
  return c.json({ message: "Hello from Hono API!" });
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
