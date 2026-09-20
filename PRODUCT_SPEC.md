# CampusSync: Professional Lost & Found Specification

## 1. Product Overview
CampusSync Lost & Found is a trust-based recovery platform designed for university environments. It replaces informal "group chats" with a structured verification and real-time messaging system.

## 2. Business Logic & Item Lifecycle

### A. The "Lost" Workflow
1.  **Reporting**: A user posts a "Lost" item (Title, Location, Date, Category).
2.  **Public Feed**: The item is visible to the entire campus.
3.  **Discovery**: Another user sees the post and clicks **"I Found This"**.
4.  **Instant Connection**: The system opens a **Private Chat** with a pre-filled "Item Found" context message.
5.  **Resolution**: Once the owner receives the item, they mark it as **"Resolved"** from their dashboard.

### B. The "Found" Workflow (Complex Verification)
1.  **Reporting**: A user posts a "Found" item (Note: Images/Descriptions should be vague to prevent fraudulent claims).
2.  **Claim Submission**: A seeker clicks **"Reclaim Belonging"**.
3.  **Verification Form**: Seeker must provide identifying details (e.g., "The wallpaper is a cat", "The case has a crack").
4.  **Owner Review**: The finder reviews all claims in a **Review Dashboard**.
5.  **Claim Scoring**: Finder assigns a "Claim Score" (0-100).
    -   **Approved (>=60)**: Item status changes to **CLAIMED**. All other pending claims for that item are automatically **REJECTED**.
    -   **Rejected (<60)**: Seeker is notified in their "My Claims" list.

## 3. Backend Features (Maturity Requirements)
-   **Socket.io Integration**: New messages and claim updates must be broadcasted instantly.
-   **Conflict Resolution**: Backend must programmatically enforce that an item can only be claimed once.
-   **Data Consistency**: Automated timestamps, normalized user IDs, and secured image storage (Cloudinary).
-   **Security**: Middleware prevents users from claiming their own items or accessing private message threads.

## 4. Frontend Features (UX Requirements)
-   **Contextual UI**: Dynamic buttons that change based on item type (Lost vs. Found).
-   **Status Badges**: High-visibility tags (Active, Claimed, New).
-   **User Stats**: Profile dashboard showing "Items Recovered" to build campus reputation.
-   **Registry Filtering**: Proper search by category and location to handle high campus volume.

---

## 5. Technical Requirements (Standards)
-   **API Persistence**: All calls must use a standardized `axios` client with `withCredentials`.
-   **State Management**: Redux Toolkit for real-time item and message updates.
-   **Refined Aesthetics**: Vibrant, premium design with Dark/Light mode support.
