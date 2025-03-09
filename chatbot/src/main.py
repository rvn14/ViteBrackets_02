from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from fastapi import HTTPException
from fastapi.responses import JSONResponse

from src.api.endpoints import router
from src.config.logging_config import setup_logging
from src.config.settings import CORS_ORIGINS

# Set up logging
setup_logging()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": str(exc.detail)},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"},
    )

@app.on_event("startup")
async def startup_event():
    logger = logging.getLogger(__name__)
    logger.info("Application started successfully")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info") 