from flask import Flask, request
import redis
import hashlib
import asyncio
from .summary import get_summary
from transcriptionfeature import get_transcription
from redis.exceptions import LockError

app = Flask(__name__)
cache = redis.Redis(host='localhost', port=6379, db=0)
pubsub = cache.pubsub()

def get_cache_key(text):
    return hashlib.md5(text.encode()).hexdigest()

async def handle_message(message):
    text = message['data'].decode('utf-8')
    cache_key = get_cache_key(text)
    lock = cache.lock(cache_key, timeout=10)  # Acquire a lock with a timeout

    try:
        if lock.acquire(blocking=False):
            cached_transcription = cache.get(cache_key)
            
            if cached_transcription:
                transcription = cached_transcription.decode('utf-8')
            else:
                transcription = await asyncio.to_thread(get_transcription, text)
                cache.set(cache_key, transcription)
            
            # Process the transcription (e.g., store it, send it to another service, etc.)
            print(f"Processed transcription: {transcription}")
        else:
            print(f"Lock not acquired for {cache_key}, skipping message.")
    finally:
        lock.release()

async def subscribe_to_channel(channel):
    pubsub.subscribe(channel)
    while True:
        message = pubsub.get_message()
        if message and message['type'] == 'message':
            await handle_message(message)
        await asyncio.sleep(0.01)

@app.route('/transcribe', methods=['GET', 'POST'])
async def transcribe():
    if request.method == 'POST':
        text = request.form.get('text')
    else:
        text = request.args.get('text')
    
    if text:
        cache_key = get_cache_key(text)
        cached_transcription = cache.get(cache_key)
        
        if cached_transcription:
            return cached_transcription.decode('utf-8')
        
        transcription = await asyncio.to_thread(get_transcription, text)
        cache.set(cache_key, transcription)
        return transcription
    else:
        return "No text provided", 400

@app.route('/about')
def about():
    return "About the Newsletter"

if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.create_task(subscribe_to_channel('transcription_requests'))
    app.run(debug=True, use_reloader=False)
    loop.run_forever()

