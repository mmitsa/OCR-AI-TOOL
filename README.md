# Chandra-Bot AI Archiving Dashboard 🤖📂

An enterprise-grade, hybrid AI-powered document archiving and RPA (Robotic Process Automation) system designed for high-efficiency digital transformation. This dashboard centralizes document capture, intelligent analysis, and automated data entry.

## 🏗 System Architecture (Hybrid AI)

Chandra-Bot utilizes a sophisticated **"Smart Hybrid"** architecture:
1.  **Level 1: Chandra OCR (Local/Edge):** Performs high-speed optical character recognition to convert physical scans into raw digital text.
2.  **Level 2: Gemini AI (Cognitive Layer):** Analyzes raw text to extract logical entities (Subject, Dates, Security Levels, IDs) using advanced LLM reasoning.
3.  **Level 3: RPA Integration (Action Layer):** Automatically populates legacy archiving systems or databases with the extracted structured data.

## ✨ Key Features

-   **Live Operations Dashboard:** Real-time monitoring of processing logs, system health, and archiving statistics.
-   **Intelligent Queue Management:** Track documents from "Pending" to "Archived" with detailed metadata previews.
-   **Advanced Scanner Linking:** Technical settings to bind hardware scanners (TWAIN/WIA) and calibrate OCR quality.
-   **Folder Watcher Integration:** Configurable input/output paths for automated "Drop-and-Archive" workflows.
-   **Standardized Schema:** Aligned with National Center for Archives & Records (Saudi Arabia) standards for document classification.
-   **Metronic-Inspired UI:** A clean, modern, and responsive RTL (Right-to-Left) interface designed for professional administrative environments.

## 🚀 Tech Stack

-   **Frontend:** React 19, TypeScript
-   **Styling:** Tailwind CSS (Metronic aesthetic)
-   **Intelligence:** Google Gemini API (`gemini-3-flash-preview`)
-   **Icons:** Lucide-React
-   **State Management:** React Hooks

## 🛠 Setup & Configuration

### Prerequisites
-   Node.js and npm/yarn.
-   A valid Google Gemini API Key.

### Environment Variables
The application requires an API key to communicate with the Gemini cognitive layer:
`process.env.API_KEY = "YOUR_GEMINI_API_KEY"`

### Installation
1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Start the development server: `npm start`.

## 📂 Project Structure

-   `App.tsx`: Main application logic and UI routing.
-   `types.ts`: TypeScript interfaces for documents, logs, and system states.
-   `services/geminiService.ts`: Integration with the `@google/genai` SDK for document analysis.
-   `metadata.json`: Project metadata and permissions.
-   `index.html`: Main entry point with RTL support and external font loading.

## 🛡 Security & Compliance
-   Supports **Security Level** classification (Normal, Secret, Top Secret).
-   Local OCR processing ensures sensitive text is handled efficiently before AI summarization.

---
*Developed for professional archiving departments aiming for 100% digital automation.*