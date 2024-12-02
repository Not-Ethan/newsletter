import redis
import json
import dotenv
import os
dotenv.load_dotenv("../.env")
from transcriptionfeature import get_transcription
from summary.summary import main as summarize

def process_task(transcription_url):
    """
    Worker function to process transcription and summarization.
    """
    transcription = get_transcription(transcription_url)
    if transcription:
        summarized_text = summarize(transcription)
        return summarized_text

# Initialize Redis
redis_client = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=os.getenv("REDIS_PORT",6379), db=0)
list_name = 'transcription_urls'
pubsub_channel = 'completed_tasks'

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
    task_id = task_data['task_id']
    transcription_url = task_data['transcription_url']
    
    print(f"Processing transcription URL: {transcription_url} with Task ID: {task_id}")
    
    # Process the transcription and summarization
    summarized_text = process_task(transcription_url)
    
    # Store the summarized text in Redis using the UUID as the key
    redis_client.set(f"summary:{task_id}", summarized_text)

    #notify the completion of the task
    redis_client.publish(pubsub_channel, json.dumps({"task_id": task_id}))

# Start processing tasks
read_from_list(redis_client, list_name)
