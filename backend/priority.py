"""

priority.py

-----------

Priority queue implementation for campus notifications.



Uses Python's heapq module for efficient top-N retrieval.

Complexity: O(n log k) where n = total notifications, k = requested top-N.



Priority Rules:

    Placement > Result > Event



Weights:

    Placement = 3

    Result    = 2

    Event     = 1



Priority Score Formula:

    score = (weight * 1000) - age_in_minutes

"""

import heapq

from datetime import datetime

from typing import List, Dict, Any



                                                                             

                                             

                                                                             

PRIORITY_WEIGHTS: Dict[str, int] = {

    "Placement": 3,

    "Result": 2,

    "Event": 1,

}





def _calculate_priority_score(notification: Dict[str, Any]) -> float:

    """

    Calculate the priority score for a single notification.



    Formula:

        score = (weight * 1000) - age_in_minutes



    Higher score = higher priority.

    Newer notifications of the same type rank higher.



    Parameters:

        notification - A notification dict with 'Type' and 'Timestamp' keys.



    Returns:

        A float representing the priority score.

    """

    notification_type = notification.get("Type", "Event")

    weight = PRIORITY_WEIGHTS.get(notification_type, 1)



                                                  

    timestamp_str = notification.get("Timestamp", "")

    try:

        notification_time = datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")

        age_in_minutes = (datetime.now() - notification_time).total_seconds() / 60.0

    except (ValueError, TypeError):

                                                                 

        age_in_minutes = 999999.0



    score = (weight * 1000) - age_in_minutes

    return score





def get_top_n_priority_notifications(

    notifications: List[Dict[str, Any]], n: int = 10

) -> List[Dict[str, Any]]:

    """

    Return the top N most important notifications using a min-heap.



    Complexity: O(n log k) where n = len(notifications), k = n (requested count).



    The min-heap keeps the k highest-scored notifications. For each new

    notification we push it onto the heap and pop the smallest if the heap

    exceeds size k.  At the end the heap contains exactly the top-k items

    sorted by descending priority.



    Parameters:

        notifications - Full list of notification dicts from the external API.

        n             - Number of top notifications to return.



    Returns:

        A list of the top-N notification dicts sorted by priority (highest first),

        each augmented with a 'priority_score' field.

    """

    if not notifications:

        return []



                                                 

    n = min(n, len(notifications))



                                                      

                                                                                    

    heap: list = []



    for idx, notif in enumerate(notifications):

        score = _calculate_priority_score(notif)



        if len(heap) < n:

            heapq.heappush(heap, (score, idx, notif))

        else:

                                                                           

            if score > heap[0][0]:

                heapq.heapreplace(heap, (score, idx, notif))



                                                                        

    top_notifications = []

    while heap:

        score, _, notif = heapq.heappop(heap)

                                                               

        notif_with_score = {**notif, "priority_score": round(score, 2)}

        top_notifications.append(notif_with_score)



                                          

    top_notifications.reverse()



    return top_notifications

