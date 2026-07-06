# AI Code Explainer

AI Code Explainer is a simple web app that helps beginners understand JavaScript code. Paste some JavaScript into the input box, and the app sends it to a backend service that uses the Gemini API to generate a beginner-friendly explanation.

## Features

- Paste JavaScript code directly into the browser
- Send code to a Node.js backend for explanation
- Receive a clear, beginner-friendly explanation
- Display the explanation in a readable format

## Project Structure

- `index.html` - Main frontend page
- `style.css` - Styling for the app
- `script.js` - Frontend logic for sending code to the backend
- `backend/index.js` - Express server that calls the Gemini API
- `backend/package.json` - Backend dependencies and scripts

## Prerequisites

Before running the app, make sure you have:

- Node.js installed
- A Gemini API key from Google AI Studio

## Setup

1. Open the project folder.
2. Go to the backend folder:
   ```bash
   cd backend
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file inside the backend folder and add your API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
6. Open the frontend file in your browser:
   - Open `index.html` in a browser, or use a live server extension.

## Usage

1. Paste your JavaScript code into the text area.
2. Click the "Explain Code" button.
3. Read the generated explanation in the output section.

## Notes

- The backend runs on port `3000` by default.
- If the API key is missing, the server will return an error until it is configured.
- The app is intended for learning and beginner-friendly explanations.

## Tech Stack

- HTML, CSS, JavaScript
- Express.js
- Node.js
- Gemini API
