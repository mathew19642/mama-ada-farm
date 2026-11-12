# 🌱 Mama Ada Farm — Web Application

A full-featured agricultural web application featuring real-time crop planting schedules, guided farm tour bookings with automated calendar integration, customizable recurring harvest box delivery scheduling, and live customer notifications.

---

## 🌟 Key Features

### 1. 📅 Interactive Crop Planting & Growth Calendar
* **Real-time Lifecycle Stages:** Track crops through *Seedling*, *Vegetative*, *Flowering / Fruiting*, and *Harvest Ready*.
* **Dynamic Countdown:** Calculates days remaining until harvest based on today's calendar date.
* **Category Filters:** Filter by *Leafy Greens*, *Fruits & Orchards*, *Root Vegetables*, *Herbs & Aromatics*, and *Legumes & Grains*.
* **Crop Detail Modal:** Displays organic soil practices, farm sections (e.g. Greenhouse 1, Hillside Orchard), and nutritional highlights.

### 2. 🚜 Farm Visit & Guided Crop Walk Booking
* **Date & Time Slot Selector:** Morning Dew Walk (9:30 AM), Greenhouse & Bio-Compost Tour (11:30 AM), or Sunset Orchard Walk (3:30 PM).
* **Crop Inspection Tags:** Customers can tag specific crops they want to inspect during the tour.
* **Instant Calendar Sync:**
  * **`.ics` File Generation:** Download standard iCalendar invite files that automatically load into Apple Calendar, Google Calendar, and Outlook with 24-hour reminder alarms.
  * **One-Click Google Calendar:** Direct link to create the event with farm location pin and visit notes.

### 3. 🧺 Scheduled Produce Delivery Engine
* **Flexible Basket Selector:** Pick in-season vegetables and fruits with dynamic quantity controls.
* **Preferred Harvest Day:** Select preferred delivery day (e.g., *Wednesday*, *Friday*, or *Saturday*).
* **Delivery Frequency & Repetition:** Choose 1x one-time trial, 2x bi-weekly, 4x weekly monthly subscription (5% off), or up to 8–12 season passes.
* **Calculated Shipment Timeline:** Automatically computes and displays the exact calendar dates of each upcoming shipment.

### 4. 🔔 Genuine Live Notifications
* **Client-Side Live Emails (Web3Forms / EmailJS):** Uses lightweight client endpoints so real emails are dispatched directly to both the customer and the farm manager without requiring a backend server.
* **Admin Operations Console:** Manage crop growth stages directly in the browser and send test notification emails.
* **Browser Activity Portal:** Customer bookings and scheduled deliveries are saved and restored from browser `localStorage`.

---

## 🛠️ Technology Stack & Languages

* **HTML5:** Semantic layouts, date inputs, accessible forms.
* **CSS3 & Tailwind CSS v4:** Responsive mobile-first styling, badges, and progress animations.
* **JavaScript / TypeScript:** Strict type checking, date interval math, calendar generation, and state management.
* **Vite + React 19:** Modern, high-performance web runtime.
* **Lucide React:** Agricultural and UI icon suite.
* **Canvas-Confetti:** Interactive feedback on booking and order submission.

---

## 🚀 Getting Started

### 1. Run Locally
```bash
# In the mama-ada-farm directory:
npm install
npm run dev
```
Open your browser at `http://localhost:5173` to view the live website.

### 2. Build for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🌐 Deploying Live to the Web (Free)

You can host this application online for free in under 2 minutes:

### Option A: Vercel (Recommended)
1. Push your repository to GitHub.
2. Sign in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your `mama-ada-farm` repository.
4. Click **Deploy**. Vercel will build and assign you a free `https://mama-ada-farm.vercel.app` domain with automated SSL.

### Option B: Netlify
1. Run `npm run build`.
2. Drag and drop the `dist/` folder directly onto [Netlify Drop](https://app.netlify.com/drop).

---

## 🔑 Activating Live Email Dispatch

1. Visit [web3forms.com](https://web3forms.com) and enter the farm's email address to receive your free access key.
2. Open the **Farm Manager Console** (the shield icon 🛡️ in the top right navbar) on the website.
3. Paste your key into the **Web3Forms Access Key** field and click **"Test Send"**.
4. Real booking invitations and delivery receipts will now land directly in your customers' inboxes!
