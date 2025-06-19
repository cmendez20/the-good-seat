import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "./db/index.js";
import * as schema from "./db/schema.js";
import { eq, and } from "drizzle-orm";

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

const reviewFormSchema = z.object({
  theatreName: z.string().min(1, { message: "Theatre name is required" }),
  screenType: z.enum(["digital", "dolby", "imax", "laser"]),
  auditoriumNumber: z.coerce.number().int().positive(),
  row: z.string().min(1, { message: "Row is required" }),
  seatNumber: z.coerce.number().int().positive(),
  notes: z.string().optional(),
  yes: z.string().optional(),
});

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
      notes: schema.reviews.notes,
      liked: schema.reviews.liked,
      timestamp: schema.reviews.createdAt,
    })
    .from(schema.reviews)
    .leftJoin(schema.screens, eq(schema.reviews.screenId, schema.screens.id))
    .where(eq(schema.reviews.theatreId, parseInt(theatreId)));

  return c.json(reviews);
});

app.post("/api/reviews", zValidator("form", reviewFormSchema), async c => {
  const body = c.req.valid("form");

  // In a real app, this would come from an auth middleware, e.g., c.get('user').id
  const userId = 1;

  try {
    // --- Step 4: Handle Theatre (Get-or-Create) ---
    let theatreId: number;

    // Look for an existing theatre
    const existingTheatre = await db
      .select({ id: schema.theatres.id })
      .from(schema.theatres)
      .where(eq(schema.theatres.name, body.theatreName.trim()))
      .get(); // .get() is for Drizzle SQLite to get a single record

    if (existingTheatre) {
      theatreId = existingTheatre.id;
    } else {
      // Create a new theatre if it doesn't exist
      const newTheatre = await db
        .insert(schema.theatres)
        .values({
          name: body.theatreName.trim(),
          // You might need to ask the user for this data in the form
          // or have a separate process for enriching it.
          city: "Unknown",
          state: "Unknown",
          country: "USA",
        })
        .returning({ id: schema.theatres.id })
        .get();
      theatreId = newTheatre.id;
    }

    // --- Step 5: Handle Screen (Get-or-Create) ---
    let screenId: number;
    const screenName = `Auditorium ${body.auditoriumNumber}`; // Standardize screen name

    // Look for an existing screen within that specific theatre
    const existingScreen = await db
      .select({ id: schema.screens.id })
      .from(schema.screens)
      .where(
        and(
          eq(schema.screens.theatreId, theatreId),
          eq(schema.screens.name, screenName)
        )
      )
      .get();

    if (existingScreen) {
      screenId = existingScreen.id;
    } else {
      // Create a new screen if it doesn't exist
      const newScreen = await db
        .insert(schema.screens)
        .values({
          theatreId: theatreId,
          name: screenName,
          // The form uses lowercase, the schema uses Titlecase. We'll just cast it.
          screenType: (body.screenType.charAt(0).toUpperCase() +
            body.screenType.slice(1)) as "Digital" | "Laser" | "Dolby" | "IMAX",
        })
        .returning({ id: schema.screens.id })
        .get();
      screenId = newScreen.id;
    }

    // --- Step 6: Insert the Review ---
    // Transform the checkbox value 'yes' to the schema's enum
    const likedValue = body.yes === "on" ? "yes" : "no";

    const newReview = await db
      .insert(schema.reviews)
      .values({
        userId: userId,
        theatreId: theatreId,
        screenId: screenId,
        seatRow: body.row.toUpperCase(),
        seatNumber: body.seatNumber,
        notes: body.notes,
        liked: likedValue,
      })
      .returning()
      .get();

    // --- Step 7: Return a success response ---
    return c.json(
      {
        message: "Review created successfully!",
        review: newReview,
      },
      201
    ); // 201 Created
  } catch (error: any) {
    console.error("Failed to create review:", error);
    return c.json(
      { error: "Failed to create review", details: error.message },
      500
    );
  }
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
