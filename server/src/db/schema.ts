import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

// -----------------------------------------------------------------------------
// 1. USERS TABLE
// Stores user information for authentication and associating reviews.
// -----------------------------------------------------------------------------
export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey(),
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
// 2. THEATRES TABLE
// Stores information about each movie theatre location.
// -----------------------------------------------------------------------------
export const theatres = sqliteTable("theatres", {
  id: integer("id", { mode: "number" }).primaryKey(),
  name: text("name").notNull(), // e.g., "AMC Metreon 16"
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export const theatresRelations = relations(theatres, ({ many }) => ({
  screens: many(screens), // A theatre has many screens
  reviews: many(reviews), // A theatre has many reviews
}));

// -----------------------------------------------------------------------------
// 3. SCREENS TABLE (Auditoriums)
// Each theatre has multiple screens/auditoriums.
// -----------------------------------------------------------------------------
export const screens = sqliteTable("screens", {
  id: integer("id", { mode: "number" }).primaryKey(),
  theatreId: integer("theatre_id")
    .notNull()
    .references(() => theatres.id, { onDelete: "cascade" }), // Link to theatres table
  name: text("name").notNull(), // e.g., "Auditorium 7", "IMAX with Laser"
  screenType: text("screen_type", {
    enum: ["Digital", "Laser", "Dolby", "IMAX"],
  })
    .notNull()
    .default("Laser"),
  theatreChain: text("theatre_chain"),
});

export const screensRelations = relations(screens, ({ one, many }) => ({
  theatre: one(theatres, {
    fields: [screens.theatreId],
    references: [theatres.id],
  }),
  reviews: many(reviews), // A screen has many reviews
}));

// -----------------------------------------------------------------------------
// 4. REVIEWS TABLE
// This is the core table, connecting users, seats, and ratings.
// -----------------------------------------------------------------------------
export const reviews = sqliteTable("reviews", {
  id: integer("id", { mode: "number" }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Link to users table
  theatreId: integer("theatre_id")
    .notNull()
    .references(() => theatres.id, { onDelete: "cascade" }), // Link to theatres table
  screenId: integer("screen_id")
    .notNull()
    .references(() => screens.id, { onDelete: "cascade" }), // Link to screens table

  // Seat Information
  seatRow: text("seat_row").notNull(), // e.g., "G"
  seatNumber: integer("seat_number").notNull(), // e.g., 12

  notes: text("notes"),
  liked: text("liked", { enum: ["yes", "no"] }),

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
  theatre: one(theatres, {
    fields: [reviews.theatreId],
    references: [theatres.id],
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
  id: integer("id", { mode: "number" }).primaryKey(),
  reviewId: integer("review_id")
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
