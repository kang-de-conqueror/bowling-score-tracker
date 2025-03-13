# Bowling Score Application

This application lets you create and manage bowling games for up to five players, recording and calculating scores in real-time. It is composed of a **backend** (NestJS + SQLite) and a **frontend** (Next.js).

---

## Table of Contents

1. [Overview](#overview)
2. [User Stories](#user-stories)
3. [Technologies](#technologies)
4. [Setup & Installation](#setup--installation)
5. [Usage](#usage)
6. [API Endpoints (High-Level)](#api-endpoints-high-level)
7. [Production Deployment](#production-deployment)

---

## Overview

This Bowling Score Application provides a simple workflow for:

1. **Creating a Game**: Up to five players can be added, each with a name.
2. **Viewing the Game List**: Displays existing games in the system.
3. **Playing a Game**: For each created game, players can take turns entering their frame scores (numbers, `X` for strike, `/` for spare). The system calculates scores in real-time.
4. **View Final Result**: At the end, a scoreboard shows the final tally and highlights the winner.

---

## User Stories

1. **Create a Game**
   _“As a player, I want to enter my name and up to 4 other players…”_
   **Acceptance Criteria**

   - An input for up to 5 player names.
   - The game starts only after all player names are entered.

2. **Enter Scores**
   _“As a player, I want to enter my score for each frame…”_
   **Acceptance Criteria**

   - Input fields for each frame and roll.
   - Accept numeric values, `X` (strike), `/` (spare).

3. **Automatic Score Calculation**
   _“As a player, I want the system to automatically calculate my score…”_
   **Acceptance Criteria**

   - Standard bowling scoring logic (spares, strikes, bonus rolls).
   - Total updates in real time.

4. **Progress Tracking**
   _“As a player, I want to see a summary of scores for all players after each frame…”_
   **Acceptance Criteria**

   - A scoreboard showing each player’s scores.
   - The current frame is highlighted.

5. **Final Scores & Winner**
   _“As a player, I want to see the final scores and the winner at the end…”_
   **Acceptance Criteria**
   - Final scores for all players displayed.
   - The highest-scoring player is highlighted as the winner.

---

## Technologies

- **Backend**

  - Nest.js
  - SQLite
  - TypeORM

- **Frontend**
  - Next.js
  - TypeScript
  - Tailwind CSS

---

## Setup & Installation

1. **Clone the Repository**

   ```bash
   git clone <repo-url>
   cd <repo-folder>
   ```

2. **Install Dependencies**

   - **Backend**:
     ```bash
     cd backend
     npm install
     ```
   - **Frontend**:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Configure the Database**

   - By default, a SQLite file is used.

4. **Running the Backend**

   ```bash
   cd backend
   npm run start:dev
   ```

   This should start Nest.js on a default port (e.g., `http://localhost:5000`).

5. **Running the Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   Access the UI at `http://localhost:3000` (or whichever port Next.js uses).

---

## Usage

1. **Home Page**

   - Enter up to 5 player names.
   - Click “Create Game.”
   - The server creates a new game with 10 frames per player.

2. **List of Games**

   - Shows all existing games in the system.
   - Click “Continue Game” to open a specific game, or “Show Scoreboard” to see the scoreboard.

3. **Game Details**

   - For each created game, players can take turns entering scores for frames 1–10.
   - Use numeric inputs plus special characters (`X` for strike, `/` for spare).
   - The system calculates partial or final totals in real-time.
   - The scoreboard can be opened anytime and automatically shows when the 10th frame is complete.

4. **Scoreboard**
   - Displays frame-by-frame inputs and totals for each player.
   - Highlights the winner if the game is done.

---

## API Endpoints (High-Level)

All endpoints are in the **backend** Nest.js application.

- **POST** `/games`
  Create a new game with up to 5 players.

- **GET** `/games`
  Fetch a list of all games.

- **GET** `/games/:gameId`
  Get game details and player information.

- **GET** `/frames/:playerId/:gameId`
  Retrieve all frames for a specific player in a specific game.

- **PATCH** `/frames/:frameId`
  Update rolls (first, second, bonus) for a specific frame.

- **GET** `/games/:gameId/scoreboard`
  Return scoreboard data (frames + totals) for each player.

---

## Production Deployment

Below are guidelines for deploying this Bowling Score Application in a **production environment**. Note that **SQLite is only used here for demo/testing purposes**; in a real production setting, you would likely replace SQLite with a more robust database such as PostgreSQL, MySQL, or another supported TypeORM adapter.

1. **Separate Builds for Frontend and Backend**

   - **Backend (NestJS)**
     - Build by running `npm run build` in the `backend` folder. This compiles TypeScript to JavaScript for production.
     - Start with `npm run start:prod` or an equivalent NestJS command.
     - Update **ORM** and **DB** configurations to point to a production-ready database (PostgreSQL, MySQL, etc.) rather than SQLite.
   - **Frontend (Next.js)**
     - From the `frontend` directory, run `npm run build` to produce an optimized production build.
     - Launch the app via `npm run start`. It serves your Next.js site on a designated port (e.g., 3000).

2. **Database Configuration**

   - **Do not** use SQLite in production (it’s included for simplicity).
   - Switch to a persistent database (PostgreSQL, MySQL, etc.) with proper **TypeORM** config.
   - Store credentials and DB connection info in secure environment variables or a secrets manager.

3. **Process Management**

   - Use a **process manager** (like `pm2`) or containers (like Docker) to run and manage the backend.
   - For Next.js, you can similarly run the Node process behind a process manager or container orchestration.

4. **Hosting**

   - **Option A**: Dockerize both services. Each container runs separate code (NestJS, Next.js). Use a reverse proxy or load balancer to route requests.
   - **Option B**: Deploy each service separately to a Node.js-friendly host (AWS EC2, Heroku, or any VPS).
   - **Option C**: Host both on the same machine, using a reverse proxy (NGINX) that routes `/api/` requests to the NestJS service and other requests to the Next.js frontend.

5. **Security & Environment Variables**

   - Enforce **HTTPS**. Set up an SSL certificate on your load balancer or server.
   - Never commit credentials to version control. Store DB and other secrets in environment variables or a secure secrets manager.
   - Validate user input to guard against injection or malicious requests.

6. **Scaling**

   - **Backend**: Replicate containers or processes behind a load balancer if high traffic is expected.
   - **Frontend**: Serve Next.js statically with caching or push the dynamic Node server to a scalable service.
   - Use a CDN to offload static asset delivery (images, scripts, etc.).

7. **Monitoring & Logging**

   - Configure logs to flow into a centralized system (e.g., ELK stack, AWS CloudWatch, Datadog).
   - Track performance metrics (CPU, memory, request latencies) to preemptively address issues.

8. **CI/CD Pipeline**
   - Automate build/test with tools like GitHub Actions, Jenkins, or CircleCI.
   - Deploy automatically to production upon a successful build or after passing QA checks.
