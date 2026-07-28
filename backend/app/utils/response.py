from typing import Any, Optional
from fastapi.responses import JSONResponse

def success_response(data: Any, message: str = "Operation successful", status_code: int = 200) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "message": message,
            "data": data
        }
    )

def error_response(message: str, error_details: Optional[Any] = None, status_code: int = 400) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "message": message,
            "error": error_details
        }
    )
