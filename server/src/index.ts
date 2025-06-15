import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { eq } from "drizzle-orm";

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

app.get("/api/theatres", async c => {
  const theatres = await db
    .select({
      id: schema.theatres.id,
      name: schema.theatres.name,
      city: schema.theatres.city,
      state: schema.theatres.state,
    })
    .from(schema.theatres);
  return c.json(theatres);
});

app.get("/api/theatres/:theatreId", async c => {
  const { theatreId } = c.req.param();
  const theatre = await db
    .select({
      name: schema.theatres.name,
      city: schema.theatres.city,
      state: schema.theatres.state,
    })
    .from(schema.theatres)
    .where(eq(schema.theatres.id, parseInt(theatreId)));
  return c.json(theatre);
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

app.get("/api/reviews/:theatreId", async c => {
  const { theatreId } = c.req.param();
  const reviews = await db
    .select({
      screenId: schema.reviews.screenId,
      screenName: schema.screens.name,
      screenType: schema.screens.screenType,
      seatRow: schema.reviews.seatRow,
      seatNum: schema.reviews.seatNumber,
      title: schema.reviews.title,
      body: schema.reviews.body,
      viewRating: schema.reviews.viewRating,
      comfortRating: schema.reviews.comfortRating,
      soundRating: schema.reviews.soundRating,
      timestamp: schema.reviews.createdAt,
    })
    .from(schema.reviews)
    .leftJoin(schema.screens, eq(schema.reviews.screenId, schema.screens.id))
    .where(eq(schema.reviews.theaterId, parseInt(theatreId)));

  return c.json(reviews);
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
