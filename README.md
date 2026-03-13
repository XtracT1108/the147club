# the147club Dashboard

![Live Status](https://img.shields.io/badge/Status-Live-success) 
![React](https://img.shields.io/badge/React-19.0-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![Firebase](https://img.shields.io/badge/Firebase-11.4-FFA611)

A modern, real-time dashboard for **The 147 Club**, built to track snooker table occupancy and global club status. 

Recently migrated from a vanilla HTML/CSS architecture to a robust **React Single Page Application (SPA)** with premium UI components.

🔗 **Live Site:** [https://the147club-hq.web.app](https://the147club-hq.web.app) (Soon via custom domain `the147club.xtract.website`)

---

## ✨ Features

- **Real-Time Synchronization:** Uses Firebase Firestore `onSnapshot` to instantly push table updates to all connected clients without refreshing.
- **Customer Dashboard (Public):** Beautiful, read-only view of the club's current status and individual table availability, featuring stunning Magic UI effects like `BorderBeam`, `Ripple`, and `AnimatedShinyText`.
- **Admin Control Panel (Protected):** Secure login for staff to toggle table statuses (FREE, BUSY, RESERVED) and open/close the club.
- **Superuser Master Console (Protected):** Exclusive access to create new admin accounts and view an immutable audit trail of all staff actions.
- **Location integration:** Embedded Google Maps directly to the club's location.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **UI Libraries:** 
  - [shadcn/ui](https://ui.shadcn.com/) (Card, Badge, Button, Input, Separator)
  - [Magic UI](https://magicui.design/) (Animations, Gradients, Dot Patterns)
- **Backend & Database:** Firebase (Authentication, Firestore Realtime Database)
- **Deployment:** Firebase Hosting
- **Routing:** React Router DOM

## 🔐 Security & Architecture

- **Role-Based Access Control (RBAC):** Users are assigned either `ADMIN` or `SUPERUSER` roles via Firestore.
- **Guarded Routes:** The UI actively hides controls depending on the authenticated user's role.
- **Firestore Security Rules:** 
  - `state` document: Anyone can read, only authenticated users can write.
  - `users` collection: Superusers only.
  - `audit_logs` collection: Authenticated users can write, only Superusers can read.

## 🚀 Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/XtracT1108/the147club.git
   cd the147club
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 👨‍💻 Developed By
[XtracT](https://www.instagram.com/xtract._/)
