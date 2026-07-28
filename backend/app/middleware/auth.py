from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

class CustomAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We can perform pre-request inspection here if needed
        response = await call_next(request)
        return response
