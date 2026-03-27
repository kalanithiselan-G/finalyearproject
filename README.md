<<<<<<< HEAD
# Audio Watermarking Anti-Piracy System

A dynamic audio watermarking system for protecting multimedia content from piracy. The system embeds unique user-specific watermarks into audio files and can detect them for forensic tracking.

## Features

- **User Authentication**: Secure registration and login system with JWT
- **Audio Watermarking**: Embed unique watermarks using DCT (Discrete Cosine Transform)
- **Watermark Detection**: Extract and identify watermarks from audio files
- **Forensic Tracking**: Track pirated content back to the source user
- **User Dashboard**: Manage watermarked content and view history
- **Warm UI Theme**: User-friendly interface with warm color palette

## Tech Stack

### Backend
- **Python** with FastAPI
- **MongoDB** for database
- **NumPy & SciPy** for audio processing
- **pydub** for audio file handling
- **JWT** for authentication

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls

## Installation

### Prerequisites

- Python 3.8+
- Node.js 16+
- MongoDB (running locally or cloud instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

6. Update the `.env` file with your MongoDB connection string and secret key.

7. Run the backend server:
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## Usage

1. **Register/Login**: Create an account or login to access the system
2. **Embed Watermark**: 
   - Upload an audio or video file
   - Optionally provide a content ID
   - Download the watermarked file
3. **Detect Watermark**: 
   - Upload a potentially watermarked file
   - View detection results with source user information
4. **View History**: See all your watermarked content

## Algorithm

The system implements a DCT-based watermarking algorithm:

1. **User Authentication**: Authenticate user and generate unique User ID
2. **Watermark ID Generation**: Create unique identifier using hash of UserID, ContentID, and Timestamp
3. **Audio Extraction**: Extract audio track and convert to WAV format
4. **Frequency-Domain Transformation**: Apply DCT to audio frames
5. **Watermark Embedding**: Embed watermark bits in mid-frequency coefficients
6. **Audio Reconstruction**: Reconstruct and deliver watermarked content
7. **Watermark Detection**: Extract and match watermark for forensic tracking

## API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info
- `POST /api/watermark/embed` - Embed watermark in file
- `POST /api/watermark/detect` - Detect watermark in file
- `GET /api/watermarks/history` - Get user's watermark history

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected API endpoints
- User-specific watermark tracking

## License

MIT
=======
# finalyearproject
>>>>>>> 309041b62b75f6ac1f1d950cebdfa436b535ef25
