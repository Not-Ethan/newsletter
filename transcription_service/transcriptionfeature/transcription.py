import yt_dlp
import whisper

def download_audio(youtube_url, output_path="audio"):
    """
    Downloads audio from a YouTube video and converts it to MP3 with optimized settings.
    """
    # yt-dlp options
    ydl_opts = {
        'format': 'bestaudio/best',  
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
        'outtmpl': output_path,  
        'noplaylist': True,  
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            print(f"Downloading and converting audio from: {youtube_url}")
            ydl.download([youtube_url])
        print(f"Audio saved to: {output_path}")
        return output_path
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def transcribe_audio(audio_path, output_text_file="transcription.txt"):
    """
    Transcribes audio using OpenAI's Whisper model and saves the transcription to a text file.
    """
    try:
        # Load the Whisper model
        print("Loading Whisper model...")
        model = whisper.load_model("base")

        # Transcribe audio
        print(f"Transcribing audio from: {audio_path}")
        result = model.transcribe(audio_path)
        print("Transcription completed.")

        # Write the transcription to a text file
        with open(output_text_file, "w", encoding="utf-8") as file:
            file.write(result['text'])
        print(f"Transcription saved to: {output_text_file}")
        return result['text']
    except Exception as e:
        print(f"An error occurred during transcription: {e}")
        return None

if __name__ == "__main__":
    # Input YouTube URL
    youtube_url = input("Enter YouTube video URL: ")
    
    # Download audio
    audio_file = download_audio(youtube_url)

    if audio_file:
        # Transcribe downloaded audio and save to a text file
        transcription = transcribe_audio('audio.mp3', output_text_file="transcription.txt")

def get_transcription(youtube_url: str) -> str:
    """
    Downloads audio from
    """
    # Download audio
    audio_file = download_audio(youtube_url)

    if audio_file:
        # Transcribe downloaded audio and save to a text file
        transcription = transcribe_audio('audio.mp3', output_text_file="transcription.txt")
        return transcription
    return None