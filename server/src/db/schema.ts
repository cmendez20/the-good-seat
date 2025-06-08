import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import Sqids from "sqids";

const sqids = new Sqids({
  alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  minLength: 8, // Minimum length for your IDs
});

// -----------------------------------------------------------------------------
// 1. USERS TABLE
// Stores user information for authentication and associating reviews.
// -----------------------------------------------------------------------------
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      // Generate a large random number to encode
      const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
      return sqids.encode([randomNum]); // Encode a single number into a Sqids string
    }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  hashedPassword: text("hashed_password").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  reviews: many(reviews), // A user can have many reviews
}));

// -----------------------------------------------------------------------------
// 2. THEATERS TABLE
// Stores information about each movie theater location.
// -----------------------------------------------------------------------------
export const theaters = sqliteTable("theaters", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      // Generate a large random number to encode
      const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
      return sqids.encode([randomNum]); // Encode a single number into a Sqids string
    }),
  name: text("name").notNull(), // e.g., "AMC Metreon 16"
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const theatersRelations = relations(theaters, ({ many }) => ({
  screens: many(screens), // A theater has many screens
  reviews: many(reviews), // A theater has many reviews
}));

// -----------------------------------------------------------------------------
// 3. SCREENS TABLE (Auditoriums)
// Each theater has multiple screens/auditoriums.
// -----------------------------------------------------------------------------
export const screens = sqliteTable("screens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      // Generate a large random number to encode
      const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
      return sqids.encode([randomNum]); // Encode a single number into a Sqids string
    }),
  theaterId: text("theater_id")
    .notNull()
    .references(() => theaters.id, { onDelete: "cascade" }), // Link to theaters table
  name: text("name").notNull(), // e.g., "Auditorium 7", "IMAX with Laser"
  screenType: text("screen_type", {
    enum: ["Standard", "IMAX", "Dolby", "RPX"],
  })
    .notNull()
    .default("Standard"),
});

export const screensRelations = relations(screens, ({ one, many }) => ({
  theater: one(theaters, {
    fields: [screens.theaterId],
    references: [theaters.id],
  }),
  reviews: many(reviews), // A screen has many reviews
}));

// -----------------------------------------------------------------------------
// 4. REVIEWS TABLE
// This is the core table, connecting users, seats, and ratings.
// -----------------------------------------------------------------------------
export const reviews = sqliteTable("reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      // Generate a large random number to encode
      const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
      return sqids.encode([randomNum]); // Encode a single number into a Sqids string
    }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Link to users table
  theaterId: text("theater_id")
    .notNull()
    .references(() => theaters.id, { onDelete: "cascade" }), // Link to theaters table
  screenId: text("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }), // Link to screens table

  // Seat Information
  seatRow: text("seat_row").notNull(), // e.g., "G"
  seatNumber: integer("seat_number").notNull(), // e.g., 12

  // The actual review content
  title: text("title").notNull(), // e.g., "Perfect center view, but legroom is tight"
  body: text("body"),

  // Ratings (1-5 scale)
  viewRating: integer("view_rating").notNull(),
  comfortRating: integer("comfort_rating").notNull(),
  soundRating: integer("sound_rating").notNull(),
  overallRating: integer("overall_rating").notNull(), // Can be calculated or user-provided

  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
});

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  theater: one(theaters, {
    fields: [reviews.theaterId],
    references: [theaters.id],
  }),
  screen: one(screens, {
    fields: [reviews.screenId],
    references: [screens.id],
  }),
  images: many(images), // A review can have multiple images
}));

// -----------------------------------------------------------------------------
// 5. IMAGES TABLE
// Stores URLs for the images associated with each review.
// -----------------------------------------------------------------------------
export const images = sqliteTable("images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => {
      // Generate a large random number to encode
      const randomNum = Math.floor(Math.random() * 1_000_000_000_000);
      return sqids.encode([randomNum]); // Encode a single number into a Sqids string
    }),
  reviewId: text("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }), // Link to reviews table
  url: text("url").notNull(), // URL from your cloud storage (e.g., Cloudflare R2, S3)
  altText: text("alt_text"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const imagesRelations = relations(images, ({ one }) => ({
  review: one(reviews, {
    fields: [images.reviewId],
    references: [reviews.id],
  }),
}));
