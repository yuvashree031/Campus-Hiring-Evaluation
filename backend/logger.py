"""
logger.py
---------
Logging middleware for the FastAPI backend.
Logs every incoming request with logID, method, path, status code, and response time.
Also provides exception logging utilities.
"""
#import
import time
import logging
import traceback
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

# ---------------------------------------------------------------------------
# Logger setup
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("campus_hiring")

# ---------------------------------------------------------------------------
# Fixed log identifier for this service
# ---------------------------------------------------------------------------

LOG_ID = "4c6b1f5c-416a-4c5b-afaa-fd26b628e9d9"

# ---------------------------------------------------------------------------
# Logging Middleware
# ---------------------------------------------------------------------------

class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that logs:
      - logID  (fixed service identifier)
      - HTTP method
      - URL path
      - Response status code
      - Response time in seconds

    Example output:
      [4c6b1f5c-416a-4c5b-afaa-fd26b628e9d9] GET /notifications -> 200 -> 0.42s
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        # Start timer before request
        start_time = time.time()

        try:
            response = await call_next(request)
        except Exception as exc:
            # Log unhandled exceptions with logID
            elapsed = time.time() - start_time
            log_exception(exc, context=f"{request.method} {request.url.path}")
            logger.error(
                "[%s] %s %s -> 500 -> %.2fs (unhandled exception)",
                LOG_ID,
                request.method,
                request.url.path,
                elapsed,
            )
            raise

        # Calculate response time after request
        elapsed = time.time() - start_time

        logger.info(
            "[%s] %s %s -> %s -> %.2fs",
            LOG_ID,
            request.method,
            request.url.path,
            response.status_code,
            elapsed,
        )

        return response

# ---------------------------------------------------------------------------
# Exception logger utility
# ---------------------------------------------------------------------------

def log_exception(exc: Exception, context: str = "") -> None:
    """
    Log an exception with full traceback.

    Parameters:
        exc     - The exception instance.
        context - Optional string describing where the error occurred.
    """
    tb = traceback.format_exception(type(exc), exc, exc.__traceback__)
    logger.error(
        "[%s] Exception in %s: %s\n%s",
        LOG_ID,
        context or "unknown context",
        str(exc),
        "".join(tb),
    )
