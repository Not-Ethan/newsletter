import redis
from transcriptionfeature import get_transcription
from .summary import main as summarize

def process_task(transcription_url):
    """
    Worker function to process transcription and summarization.
    """
    transcription = get_transcription(transcription_url)
    if transcription:
        summarized_text = summarize(transcription)
        return summarized_text
