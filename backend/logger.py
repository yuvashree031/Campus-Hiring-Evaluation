"""

logger.py

---------

Logging middleware for the FastAPI backend.

Logs every incoming request with method, path, status code, and response time.

Also provides exception logging utilities.

"""



import time

import logging

import traceback

from starlette.middleware.base import BaseHTTPMiddleware

from starlette.requests import Request

from starlette.responses import Response



                                                                             

                      

                                                                             

logging.basicConfig(

    level=logging.INFO,

    format="%(asctime)s | %(levelname)s | %(message)s",

    datefmt="%Y-%m-%d %H:%M:%S",

)

logger = logging.getLogger("campus_hiring")





                                                                             

                                       

                                                                             

class LoggingMiddleware(BaseHTTPMiddleware):

    """

    Middleware that logs:

      - HTTP method

      - URL path

      - Response status code

      - Response time in seconds

    Example output:  GET /notifications -> 200 -> 0.42s

    """



    async def dispatch(self, request: Request, call_next) -> Response:

                                                   

        start_time = time.time()



        try:

            response = await call_next(request)

        except Exception as exc:

                                                    

            elapsed = time.time() - start_time

            log_exception(exc, context=f"{request.method} {request.url.path}")

            logger.error(

                "%s %s -> 500 -> %.2fs (unhandled exception)",

                request.method,

                request.url.path,

                elapsed,

            )

            raise



                                                            

        elapsed = time.time() - start_time



        logger.info(

            "%s %s -> %s -> %.2fs",

            request.method,

            request.url.path,

            response.status_code,

            elapsed,

        )



        return response





                                                                             

                           

                                                                             

def log_exception(exc: Exception, context: str = "") -> None:

    """

    Log an exception with full traceback.

    Parameters:

        exc     - The exception instance.

        context - Optional string describing where the error occurred.

    """

    tb = traceback.format_exception(type(exc), exc, exc.__traceback__)

    logger.error(

        "Exception in %s: %s\n%s",

        context or "unknown context",

        str(exc),

        "".join(tb),

    )

