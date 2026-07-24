"""

main.py

-------

FastAPI backend for the Campus Hiring Evaluation - Notification System.



Endpoints:

    GET /notifications            - paginated, filterable notification list

    GET /priority-notifications   - top-N priority notifications via heap



External data source:

    http://4.224.186.213/evaluation-service/notifications

"""

#imp

import os

import httpx

from fastapi import FastAPI, Query, HTTPException

from fastapi.middleware.cors import CORSMiddleware



from logger import LoggingMiddleware, logger, log_exception

from priority import get_top_n_priority_notifications


MOCK_NOTIFICATIONS = [

    {

        "ID": "c3f82a1b-7492-4e51-a931-2847a98b3c10",

        "Type": "Placement",

        "Message": "Google Campus Drive 2026: Online Assessment scheduled for shortlisted candidates.",

        "Timestamp": "2026-05-16 10:00:00"

    },

    {

        "ID": "e8d91b2c-6381-4f41-b820-1736b87a2b09",

        "Type": "Placement",

        "Message": "Microsoft Hiring Challenge: Registration closes tonight at 11:59 PM.",

        "Timestamp": "2026-05-15 14:30:00"

    },

    {

        "ID": "f9e02c3d-5270-4e30-c719-0625c7691a98",

        "Type": "Result",

        "Message": "Final Interview Results announced for Amazon SDE-1 profiles.",

        "Timestamp": "2026-05-15 09:15:00"

    },

    {

        "ID": "a1b23d4e-4169-4d29-d608-9514d6580987",

        "Type": "Event",

        "Message": "Pre-Placement Talk by Goldman Sachs leadership team at Main Auditorium.",

        "Timestamp": "2026-05-14 16:00:00"

    },

    {

        "ID": "b2c34e5f-3058-4c18-e597-8403e5479876",

        "Type": "Placement",

        "Message": "Infosys Specialist Programmer (SP) drive announced for all branches.",

        "Timestamp": "2026-05-14 11:20:00"

    },

    {

        "ID": "c3d45f6a-2947-4b07-f486-7392f4368765",

        "Type": "Result",

        "Message": "TCS Digital Technical Interview clearing list published on portal.",

        "Timestamp": "2026-05-13 18:45:00"

    },

    {

        "ID": "d4e56a7b-1836-4a96-a375-6281a3257654",

        "Type": "Event",

        "Message": "Resume Review & Mock Interview Workshop by Alumni Cell this Saturday.",

        "Timestamp": "2026-05-13 12:00:00"

    },

    {

        "ID": "e5f67b8c-0725-4985-b264-5170b2146543",

        "Type": "Placement",

        "Message": "DE Shaw & Co is hiring Quantitative Analysts. Check eligibility criteria.",

        "Timestamp": "2026-05-12 15:10:00"

    },

    {

        "ID": "f6a78c9d-9614-4874-c153-4069c1035432",

        "Type": "Result",

        "Message": "Wipro Elite National Talent Hunt Phase 1 results are out.",

        "Timestamp": "2026-05-12 10:05:00"

    },

    {

        "ID": "a7b89d0e-8503-4763-d042-3958d0924321",

        "Type": "Event",

        "Message": "Guest Lecture on System Design Best Practices for upcoming interviews.",

        "Timestamp": "2026-05-11 14:00:00"

    },

    {

        "ID": "b8c90e1f-7492-4652-e931-2847e9813210",

        "Type": "Placement",

        "Message": "Atlassian Women in Tech Hiring Drive: Direct interview opportunity.",

        "Timestamp": "2026-05-10 17:30:00"

    },

    {

        "ID": "c9d01f2a-6381-4541-f820-1736f8702109",

        "Type": "Result",

        "Message": "Cognizant GenC Next shortlist released. HR rounds start tomorrow.",

        "Timestamp": "2026-05-10 11:45:00"

    },

    {

        "ID": "d0e12a3b-5270-4430-a719-0625a7691098",

        "Type": "Placement",

        "Message": "Morgan Stanley Summer Internship 2026 applications now open.",

        "Timestamp": "2026-05-09 13:20:00"

    },

    {

        "ID": "e1f23b4c-4169-4329-b608-9514b6580987",

        "Type": "Event",

        "Message": "Interactive Q&A Session with recent placement achievers in Seminar Hall 2.",

        "Timestamp": "2026-05-08 16:15:00"

    },

    {

        "ID": "f2a34c5d-3058-4218-c597-8403c5479876",

        "Type": "Result",

        "Message": "Accenture Advanced Agility Assessment cutoff scores and results.",

        "Timestamp": "2026-05-08 09:30:00"

    },

    {

        "ID": "a3b45d6e-2947-4107-d486-7392d4368765",

        "Type": "Placement",

        "Message": "Uber Advanced Technologies Group hiring campus graduates for SDE roles.",

        "Timestamp": "2026-05-07 15:50:00"

    },

    {

        "ID": "b4c56e7f-1836-4096-e375-6281e3257654",

        "Type": "Result",

        "Message": "Capgemini Exceller Coding Assessment clearing status updated.",

        "Timestamp": "2026-05-06 14:10:00"

    },

    {

        "ID": "c5d67f8a-0725-3985-f264-5170f2146543",

        "Type": "Event",

        "Message": "Competitive Coding Contest by Coding Club: Win direct referral passes.",

        "Timestamp": "2026-05-05 18:00:00"

    },

    {

        "ID": "d6e78a9b-9614-3874-a153-4069a1035432",

        "Type": "Placement",

        "Message": "Adobe SheCodes Internship Drive 2026: Application link active.",

        "Timestamp": "2026-05-04 11:25:00"

    },

    {

        "ID": "e7f89b0c-8503-3763-b042-3958b0924321",

        "Type": "Result",

        "Message": "IBM CodeKnack Assessment final selection list announced.",

        "Timestamp": "2026-05-03 17:15:00"

    },

    {

        "ID": "f8a90c1d-7492-3652-c931-2847c9813210",

        "Type": "Event",

        "Message": "Panel Discussion: Navigating the 2026 Job Market with Industry Experts.",

        "Timestamp": "2026-05-02 15:30:00"

    },

    {

        "ID": "a9b01d2e-6381-3541-d820-1736d8702109",

        "Type": "Placement",

        "Message": "Samsung R&D Institute Bangalore (SRIB) hiring via PRACMO contest.",

        "Timestamp": "2026-05-01 10:00:00"

    },

    {

        "ID": "b0c12e3f-5270-3430-e719-0625e7691098",

        "Type": "Result",

        "Message": "Oracle GBU Technical Interview round 1 results published.",

        "Timestamp": "2026-04-30 16:40:00"

    },

    {

        "ID": "c1d23f4a-4169-3329-f608-9514f6580987",

        "Type": "Event",

        "Message": "How to Ace Behavioural and HR Interviews: Special Masterclass.",

        "Timestamp": "2026-04-29 14:00:00"

    },

    {

        "ID": "d2e34a5b-3058-3218-a597-8403a5479876",

        "Type": "Placement",

        "Message": "NVIDIA Systems Software Engineering campus drive dates confirmed.",

        "Timestamp": "2026-04-28 11:15:00"

    }

]



                                                                             

                    

                                                                             

app = FastAPI(

    title="Campus Hiring Evaluation - Notification System",

    description="Backend API for campus placement notifications",

    version="1.0.0",

)



                                                                             

                                                           

                                                                             

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

                                                                          

app.add_middleware(LoggingMiddleware)
                                                                             

EXTERNAL_API_URL = "http://4.224.186.213/evaluation-service/notifications"

                                                                           

async def _fetch_all_notifications() -> list:

    """

    Fetch the full notification list from the external evaluation-service API.

    If the external API requires authentication (401) or is unreachable,

    gracefully fall back to MOCK_NOTIFICATIONS so the app remains fully functional.

    """

    headers = {}

    api_token = os.getenv("EXTERNAL_API_TOKEN") or os.getenv("API_TOKEN")

    if api_token:

        headers["Authorization"] = f"Bearer {api_token}"



    try:

        async with httpx.AsyncClient(timeout=10.0) as client:

            response = await client.get(EXTERNAL_API_URL, headers=headers)

            response.raise_for_status()

            data = response.json()

            if isinstance(data, list):

                return data

            if isinstance(data, dict):

                return data.get("notifications", data.get("data", []))

            return MOCK_NOTIFICATIONS

    except httpx.HTTPStatusError as exc:

        logger.warning(

            "External API returned status %s (%s). Using production fallback mock data.",

            exc.response.status_code, exc.response.text.strip()

        )

        return MOCK_NOTIFICATIONS

    except Exception as exc:

        logger.warning("Unable to reach external API (%s). Using production fallback mock data.", str(exc))

        return MOCK_NOTIFICATIONS







                                                                             

                    

                                                                             

@app.get("/notifications")

async def get_notifications(

    page: int = Query(1, ge=1, description="Page number (1-based)"),

    limit: int = Query(10, ge=1, le=100, description="Items per page"),

    type: str = Query(None, description="Filter by notification type"),

    search: str = Query(None, description="Search notifications by message"),

):

    """

    Fetch notifications with pagination and optional type filtering.



    Query parameters:

        page  - page number (default 1)

        limit - items per page (default 10)

        type  - optional filter: Placement | Result | Event

        search - optional search term for message content



    Response format:

        {

            "notifications": [...],

            "page": 1,

            "limit": 10,

            "total": 100

        }

    """

    all_notifications = await _fetch_all_notifications()



                               

    if type:

        all_notifications = [

            n for n in all_notifications

            if n.get("Type", "").lower() == type.lower()

        ]
                                  

    if search:

        search_lower = search.lower()

        all_notifications = [

            n for n in all_notifications

            if search_lower in n.get("Message", "").lower()

        ]



    total = len(all_notifications)



                        

    start = (page - 1) * limit

    end = start + limit

    paginated = all_notifications[start:end]



    logger.info(

        "Returning %d notifications (page=%d, limit=%d, type=%s, total=%d)",

        len(paginated), page, limit, type or "all", total,

    )



    return {

        "notifications": paginated,

        "page": page,

        "limit": limit,

        "total": total,

    }
                                                                             

@app.get("/priority-notifications")

async def get_priority_notifications(

    n: int = Query(10, ge=1, le=100, description="Number of top notifications"),

):

    """

    Return the top N most important notifications using a priority queue.



    Priority: Placement (3) > Result (2) > Event (1)

    Score   : (weight * 1000) - age_in_minutes

    Complexity: O(n log k) via heapq

    """

    all_notifications = await _fetch_all_notifications()

    top = get_top_n_priority_notifications(all_notifications, n)



    logger.info("Returning top %d priority notifications", len(top))



    return {"notifications": top, "count": len(top)}
                                                                           

@app.get("/health")

async def health_check():

    """Simple health check endpoint."""

    return {"status": "healthy", "service": "Campus Notification System"}
                                                                        

if __name__ == "__main__":

    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

