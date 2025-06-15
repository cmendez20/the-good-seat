import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { hash } from "bcryptjs";
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

async function main() {
  console.log("🌱 Starting database seeding...");

  // --- 1. Clear Existing Data (in reverse order of creation) ---
  // This allows the script to be re-run without creating duplicates.
  console.log("🧹 Clearing existing data...");
  await db.delete(schema.images);
  await db.delete(schema.reviews);
  await db.delete(schema.screens);
  await db.delete(schema.theatres);
  await db.delete(schema.users);

  // --- 2. Create Users ---
  console.log("👤 Creating users...");
  const hashedPassword1 = await hash("password123", 12);
  const hashedPassword2 = await hash("securepass", 12);

  const insertedUsers = await db
    .insert(schema.users)
    .values([
      {
        username: "cinemacritic",
        email: "critic@example.com",
        hashedPassword: hashedPassword1,
        avatarUrl: "https://i.pravatar.cc/150?img=68",
      },
      {
        username: "seatseeker",
        email: "seeker@example.com",
        hashedPassword: hashedPassword2,
        avatarUrl: "https://i.pravatar.cc/150?img=33",
      },
    ])
    .returning(); // .returning() gets the inserted data back

  const user1 = {
    ...insertedUsers[0]!,
    id: Number(insertedUsers[0]!.id),
  };
  const user2 = {
    ...insertedUsers[1]!,
    id: Number(insertedUsers[1]!.id),
  };

  // --- 3. Create Theaters ---
  console.log("🎬 Creating theatres...");
  const insertedTheaters = await db
    .insert(schema.theatres)
    .values([
      {
        name: "Grand Palace Cinemas",
        city: "Metropolis",
        state: "NY",
        country: "USA",
      },
      {
        name: "The Odeon Multiplex",
        city: "Gotham",
        state: "NY",
        country: "USA",
      },
    ])
    .returning();

  const theater1 = {
    ...insertedTheaters[0]!,
    id: Number(insertedTheaters[0]!.id),
  };
  const theater2 = {
    ...insertedTheaters[1]!,
    id: Number(insertedTheaters[1]!.id),
  };
  console.log(theater1);

  // --- 4. Create Screens for Theaters ---
  console.log("📺 Creating screens...");
  const insertedScreens = await db
    .insert(schema.screens)
    .values([
      {
        theatreId: theater1.id,
        name: "Auditorium 1",
        screenType: "Dolby",
        theatreChain: "AMC",
      },
      {
        theatreId: theater1.id,
        name: "Auditorium 2",
        screenType: "Digital",
        theatreChain: "Cinemark",
      },
      {
        theatreId: theater2.id,
        name: "Auditorium 3",
        screenType: "IMAX",
        theatreChain: "Regal",
      },
    ])
    .returning();

  const screen1_t1 = {
    ...insertedScreens[0]!,
    id: Number(insertedScreens[0]!.id),
  };
  const screen2_t1 = {
    ...insertedScreens[1]!,
    id: Number(insertedScreens[1]!.id),
  };
  const screen1_t2 = {
    ...insertedScreens[2]!,
    id: Number(insertedScreens[2]!.id),
  };

  // --- 5. Create Reviews ---
  console.log("✍️ Creating reviews...");
  const insertedReviews = await db
    .insert(schema.reviews)
    .values([
      {
        userId: user1.id,
        theatreId: theater1.id,
        screenId: screen1_t1.id,
        seatRow: "J",
        seatNumber: 15,
        notes:
          "Sitting in row J, seat 15, the view was absolutely pristine. Perfectly centered, no neck strain. The Dolby sound was immersive, and the seats themselves were plush recliners. Highly recommend this spot for a premium experience.",
        liked: "yes",
      },
      {
        userId: user2.id,
        theatreId: theater1.id,
        screenId: screen2_t1.id,
        seatRow: "C",
        seatNumber: 7,
        notes:
          "Row C is definitely too close for this standard screen. Had to look up constantly. Seats were just okay, not terrible but not great for a long movie. Sound was decent.",
        liked: "no",
      },
      {
        userId: user1.id,
        theatreId: theater2.id,
        screenId: screen1_t2.id,
        seatRow: "F",
        seatNumber: 10,
        notes:
          "Row F, seat 10 in the IMAX was fantastic for the screen size – perfectly fills your vision. Sound was powerful. However, my seat's recline function was broken, which was a shame.",
        liked: "yes",
      },
    ])
    .returning();

  const review1 = {
    ...insertedReviews[0]!,
    id: Number(insertedReviews[0]!.id),
  };
  const review3 = {
    ...insertedReviews[2]!,
    id: Number(insertedReviews[2]!.id),
  };

  // --- 6. Create Images for Reviews ---
  console.log("🖼️ Creating images...");
  await db.insert(schema.images).values([
    {
      reviewId: review1.id,
      url: "https://images.unsplash.com/photo-1616530940864-16274431b99a?q=80&w=1080",
      altText: "View from J15 at Grand Palace",
    },
    {
      reviewId: review1.id,
      url: "https://images.unsplash.com/photo-1549448332-9c9dc760778c?q=80&w=1080",
      altText: "Comfortable recliner seat in Dolby",
    },
    {
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
