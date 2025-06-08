# 💺 The Good Seat

A full-stack web application designed to help moviegoers find the best seats in any cinema! Review seats based on view, comfort, and sound, and share photos directly from your perspective.

## ✨ Features

- **Seat Reviews:** Submit detailed reviews for specific seats in movie theaters.
- **Ratings:** Rate view, comfort, and sound on a 1-5 scale.
- **Image Uploads:** Upload photos directly from the seat's perspective.
- **Theater & Screen Browsing:** Discover theaters and screens, view existing reviews.
- **User Authentication:** Secure user registration and login.
- **Search & Filter:** Find reviews by theater, screen, or seat.
- **Type-Safe:** Built with TypeScript end-to-end for robust development.

## 🚀 Technologies Used

This project leverages a modern, efficient, and type-safe stack:

**Frontend (Client):**

- **React:** A declarative, component-based JavaScript library for building user interfaces.
- **Vite:** Next-generation frontend tooling for a fast development experience.
- **React Router:** For declarative client-side routing.
- **TanStack Query (React Query):** Powerful data fetching, caching, and synchronization.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **React Hook Form & Zod:** For robust form management and validation.

**Backend (Server):**

- **Hono:** An ultra-fast, lightweight web framework for Node.js (and other runtimes).
- **Drizzle ORM:** A modern TypeScript ORM for seamless database interaction.
- **SQLite:** A lightweight, file-based relational database (great for development and small deployments).
- **Zod:** TypeScript-first schema declaration and validation.
- **Cloudflare R2:** Object storage for efficient image uploads (using pre-signed URLs).
- **JWT (JSON Web Tokens):** For secure user authentication.

## 📦 Project Structure

This project is organized into two main applications within a parent folder:
