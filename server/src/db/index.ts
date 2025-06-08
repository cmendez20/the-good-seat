import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
import Sqids from "sqids";
import * as schema from "./schema.js";

// Validate that the required environment variables are set
if (!process.env.DB_FILE_NAME) {
  throw new Error("DB_FILE_NAME environment variable is not set");
}

// Create the libsql client
const client = createClient({
  url: process.env.DB_FILE_NAME,
});

// Pass the libsql client to Drizzle
export const db = drizzle(client, { schema });

// --- ID Generation (Using Sqids as discussed) ---
// Ensure your .env has a SQIDS_SALT for consistent ID generation
const sqids = new Sqids({
  minLength: 8,
});

const generateId = () => {
  const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
  return sqids.encode([randomNum]);
};

async function main() {
  console.log("🌱 Starting database seeding...");

  // --- 1. Clear Existing Data (in reverse order of creation) ---
  // This allows the script to be re-run without creating duplicates.
  console.log("🧹 Clearing existing data...");
  await db.delete(schema.images);
  await db.delete(schema.reviews);
  await db.delete(schema.screens);
  await db.delete(schema.theaters);
  await db.delete(schema.users);

  // --- 2. Create Users ---
  console.log("👤 Creating users...");
  const hashedPassword1 = await hash("password123", 12);
  const hashedPassword2 = await hash("securepass", 12);

  const insertedUsers = await db
    .insert(schema.users)
    .values([
      {
        id: generateId(),
        username: "cinemacritic",
        email: "critic@example.com",
        hashedPassword: hashedPassword1,
        avatarUrl: "https://i.pravatar.cc/150?img=68",
      },
      {
        id: generateId(),
        username: "seatseeker",
        email: "seeker@example.com",
        hashedPassword: hashedPassword2,
        avatarUrl: "https://i.pravatar.cc/150?img=33",
      },
    ])
    .returning(); // .returning() gets the inserted data back

  const user1 = insertedUsers[0]!;
  const user2 = insertedUsers[1]!;

  // --- 3. Create Theaters ---
  console.log("🎬 Creating theaters...");
  const insertedTheaters = await db
    .insert(schema.theaters)
    .values([
      {
        id: generateId(),
        name: "Grand Palace Cinemas",
        city: "Metropolis",
        state: "NY",
        country: "USA",
      },
      {
        id: generateId(),
        name: "The Odeon Multiplex",
        city: "Gotham",
        state: "NY",
        country: "USA",
      },
    ])
    .returning();

  const theater1 = insertedTheaters[0]!;
  const theater2 = insertedTheaters[1]!;

  // --- 4. Create Screens for Theaters ---
  console.log("📺 Creating screens...");
  const insertedScreens = await db
    .insert(schema.screens)
    .values([
      {
        id: generateId(),
        theaterId: theater1.id,
        name: "Auditorium 1 (Dolby Cinema)",
        screenType: "Dolby",
      },
      {
        id: generateId(),
        theaterId: theater1.id,
        name: "Auditorium 2 (Digital)",
        screenType: "Digital",
      },
      {
        id: generateId(),
        theaterId: theater2.id,
        name: "IMAX with Laser",
        screenType: "IMAX",
      },
    ])
    .returning();

  const screen1_t1 = insertedScreens[0]!;
  const screen2_t1 = insertedScreens[1]!;
  const screen1_t2 = insertedScreens[2]!;

  // --- 5. Create Reviews ---
  console.log("✍️ Creating reviews...");
  const insertedReviews = await db
    .insert(schema.reviews)
    .values([
      {
        id: generateId(),
        userId: user1.id,
        theaterId: theater1.id,
        screenId: screen1_t1.id,
        seatRow: "J",
        seatNumber: 15,
        title: "Perfect View, Dolby Sound Amazing!",
        body: "Sitting in row J, seat 15, the view was absolutely pristine. Perfectly centered, no neck strain. The Dolby sound was immersive, and the seats themselves were plush recliners. Highly recommend this spot for a premium experience.",
        viewRating: 5,
        comfortRating: 5,
        soundRating: 5,
        overallRating: 5,
      },
      {
        id: generateId(),
        userId: user2.id,
        theaterId: theater1.id,
        screenId: screen2_t1.id,
        seatRow: "C",
        seatNumber: 7,
        title: "Too close to screen, average comfort.",
        body: "Row C is definitely too close for this standard screen. Had to look up constantly. Seats were just okay, not terrible but not great for a long movie. Sound was decent.",
        viewRating: 2,
        comfortRating: 3,
        soundRating: 4,
        overallRating: 3,
      },
      {
        id: generateId(),
        userId: user1.id,
        theaterId: theater2.id,
        screenId: screen1_t2.id,
        seatRow: "F",
        seatNumber: 10,
        title: "IMAX Sweet Spot, but seat needs repair.",
        body: "Row F, seat 10 in the IMAX was fantastic for the screen size – perfectly fills your vision. Sound was powerful. However, my seat's recline function was broken, which was a shame.",
        viewRating: 5,
        comfortRating: 3,
        soundRating: 5,
        overallRating: 4,
      },
    ])
    .returning();

  const review1 = insertedReviews[0]!;
  const review3 = insertedReviews[2]!;

  // --- 6. Create Images for Reviews ---
  console.log("🖼️ Creating images...");
  await db.insert(schema.images).values([
    {
      id: generateId(),
      reviewId: review1.id,
      url: "https://images.unsplash.com/photo-1616530940864-16274431b99a?q=80&w=1080",
      altText: "View from J15 at Grand Palace",
    },
    {
      id: generateId(),
      reviewId: review1.id,
      url: "https://images.unsplash.com/photo-1549448332-9c9dc760778c?q=80&w=1080",
      altText: "Comfortable recliner seat in Dolby",
    },
    {
      id: generateId(),
      reviewId: review3.id,
      url: "https://images.unsplash.com/photo-1574211116238-d6103681534b?q=80&w=1080",
      altText: "IMAX screen view from middle row",
    },
  ]);

  console.log("✅ Database seeding complete!");
}

main()
  .then(() => {
    console.log("Seed script finished successfully.");
  })
  .catch(err => {
    console.error("Seed script failed:", err);
    process.exit(1);
  });
