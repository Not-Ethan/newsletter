import redis
import json
import dotenv
import os
dotenv.load_dotenv("../.env")
from transcriptionfeature import get_transcription
from summary.summary import main as summarize
import logging

def process_task(transcription_url):
    """
    Worker function to process transcription and summarization.
    """
    transcription = get_transcription(transcription_url)
    if transcription:
        summarized_text = summarize(transcription)
        return summarized_text
    else:
        logging.error(f"Could not retrieve transcription for URL: {transcription_url}")
        return None

# Initialize Redis
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=os.getenv("REDIS_PORT",6379), db=0)

list_name = os.getenv("TASK_LIST", "transcription_urls")
completed_list = os.getenv("COMPLETED_LIST", "completed_tasks")

def read_from_list(redis_client, list_name):
    """
    Continuously read transcription tasks from the Redis list.
    """
    while True:
        item = redis_client.blpop(list_name, timeout=0)  # Blocking pop
        if item:
            process_item(item[1])

def process_item(item):
    """
    Process an individual transcription task.
    """
    # Decode the JSON-encoded task data
    task_data = json.loads(item.decode('utf-8'))

    # Check if the task data is valid and has the required fields
    if not task_data or 'task_id' not in task_data or 'url' not in task_data:
        logging.error(f"Invalid task data: {task_data}")
        return
    
    task_id = task_data['task_id']
    transcription_url = task_data['url']
    if not transcription_url or not task_id:
        logging.error(f"Invalid task data: {task_data}")
        return
    
    print(f"Processing transcription URL: {transcription_url} with Task ID: {task_id}")
    
    # Process the transcription and summarization
    summary_result = process_task(transcription_url)
    if not summary_result:
        logging.error(f"Could not process request for URL: {transcription_url}")
        redis_client.lpush(completed_list, json.dumps({"task_id": task_id, "status": "failed"}))
        return

    # Store the summarized text in Redis using the UUID as the key
    redis_client.set(f"task:{task_id}", json.dumps(summary_result))

    # Notify the completion of the task
    redis_client.lpush(completed_list, json.dumps({"task_id": task_id, "status": "completed"}))

# Start processing tasks
read_from_list(redis_client, list_name)