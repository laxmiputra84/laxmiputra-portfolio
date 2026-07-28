# Developer Portfolio Backend

FastAPI service powering the Full Stack Developer Portfolio.

## Tech Stack
- FastAPI
- SQLAlchemy
- MySQL
- Alembic
- JWT (python-jose)

## Setup
1. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env`.
4. Run the API server:
   ```bash
   uvicorn app.main:app --reload
   ```
