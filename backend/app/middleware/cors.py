from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

def add_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"], # adjust in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
