import yt_dlp
import logging
from pathlib import Path
from tqdm import tqdm  # For the progress bar
from faster_whisper import WhisperModel  # Faster Whisper

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class WhisperTranscriber:
    """
    Singleton class to load the Faster Whisper model once and reuse it for multiple transcriptions.
    """
    def __init__(self, model_name: str = "base", compute_type: str = "int8"):
        logging.info(f"Loading Faster Whisper model: {model_name} with compute type: {compute_type}...")
        self.model = WhisperModel(model_name, device="cpu", compute_type=compute_type)
        logging.info("Faster Whisper model loaded successfully.")

    def transcribe(self, audio_path: str, output_text_file: str = "transcription.txt") -> str:
        """
        Transcribes audio using the loaded Faster Whisper model with a progress bar and saves the transcription.

        Args:
            audio_path (str): Path to the audio file.
            output_text_file (str): Path to save the transcription.

        Returns:
            str: The transcribed text, or None if an error occurred.
        """
        try:
            logging.info(f"Starting transcription for: {audio_path}")
            
            # Transcribe the audio
            segments, info = self.model.transcribe(audio_path, beam_size=1)

            logging.info(f"Audio duration: {info.duration:.2f} seconds")
            
            # Use tqdm to track transcription progress
            with tqdm(total=info.duration, desc="Transcribing", unit="s") as pbar:
                transcription = []
                for segment in segments:
                    start, end, text = segment.start, segment.end, segment.text
                    transcription.append(text)
                    logging.info(f"Segment [{start:.2f}s - {end:.2f}s]: {text}")
                    # Update progress bar based on the end time of the segment
                    pbar.update(end - pbar.n)

            # Combine transcription text
            transcription_text = "\n".join(transcription)

            # Write transcription to file
            Path(output_text_file).write_text(transcription_text, encoding="utf-8")
            logging.info(f"Transcription saved to: {output_text_file}")

            return transcription_text
        except Exception as e:
            logging.error(f"An error occurred during transcription: {e}")
            return None

# Global instance of the transcriber
transcriber = WhisperTranscriber(model_name="base", compute_type="int8")

def download_audio(youtube_url: str, output_path: str = "audio", preferred_codec: str = "mp3", quality: str = "192") -> str:
    """
    Downloads audio from a YouTube video and converts it to the specified format.

    Args:
        youtube_url (str): The URL of the YouTube video.
        output_path (str): The output file path (without extension).
        preferred_codec (str): Preferred audio codec (e.g., "mp3").
        quality (str): Audio quality (e.g., "192").

    Returns:
        str: The path to the saved audio file, or None if an error occurred.
    """
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': preferred_codec,
            'preferredquality': quality,
        }],
        'outtmpl': f"{output_path}.%(ext)s",
        'noplaylist': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            logging.info(f"Downloading and converting audio from: {youtube_url}")
            ydl.download([youtube_url])
        output_file = f"{output_path}.{preferred_codec}"
        logging.info(f"Audio saved to: {output_file}")
        return output_file
    except Exception as e:
        logging.error(f"An error occurred during audio download: {e}")
        return None

def get_transcription(youtube_url: str, output_path: str = "audio", transcription_file: str = "transcription.txt") -> str:
    """
    Downloads audio from a YouTube video, transcribes it, and returns the transcription.

    Args:
        youtube_url (str): The URL of the YouTube video.
        output_path (str): Path to save the audio file.
        transcription_file (str): Path to save the transcription.

    Returns:
        str: The transcribed text, or None if an error occurred.
    """
    # Download audio
    audio_file = download_audio(youtube_url, output_path=output_path)

    if audio_file:
        # Transcribe downloaded audio using the global transcriber instance
        return transcriber.transcribe(audio_file, output_text_file=transcription_file)
    return None

if __name__ == "__main__":
    # Input YouTube URL
    youtube_url = input("Enter YouTube video URL: ")

    # Download and transcribe
    transcription = get_transcription(youtube_url, output_path="audio", transcription_file="transcription.txt")

    if transcription:
        print("Transcription completed successfully!")
    else:
        print("Failed to process the YouTube video.")
