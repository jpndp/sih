# Integration & Run Instructions

## 1. Start the FastAPI Backend

From the `backend` directory, run:

```
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- Make sure you have FastAPI and Uvicorn installed (`pip install fastapi uvicorn`).
- The backend will be available at http://localhost:8000

## 2. Start the Frontend (React/Next.js)

From the `frontend` directory, run:

```
npm install
npm run dev
```

- The frontend will be available at http://localhost:3000

## 3. Test the Integration

- Open http://localhost:3000 in your browser.
- Drag and drop a file or click to upload in the dashboard UI.
- You should see a response with the filename and size from the backend.

## Troubleshooting
- Ensure both servers are running and accessible.
- If you see CORS errors, make sure the backend is running with the CORS middleware enabled (already configured).
- If you change backend endpoints, update the frontend API URLs accordingly.

---

For further integration (e.g., OCR or summarization), add your logic in `backend/main.py` inside the `/api/upload` endpoint.
