import hashlib
import numpy as np
from scipy.fftpack import dct, idct
from pydub import AudioSegment
import io
from datetime import datetime, timezone
from typing import Optional
import tempfile
import subprocess
import os

# ==============================
# CONFIGURATION
# ==============================

WATERMARK_SIGNATURE = "WM||"   # Short signature
FRAME_SIZE = 1024
ALPHA = 0.08


# ==============================
# Utility Functions
# ==============================

def generate_watermark_id(user_id: str, content_id: str, timestamp: str) -> str:
    data = f"{user_id}||{content_id}||{timestamp}"
    # Shorter watermark (16 chars only)
    return hashlib.sha256(data.encode()).hexdigest()[:16]


def string_to_binary(text: str):
    return [int(bit) for char in text for bit in format(ord(char), "08b")]


def binary_to_string(bits):
    chars = []
    for i in range(0, len(bits), 8):
        byte = bits[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int("".join(map(str, byte)), 2)))
    return "".join(chars)


# ==============================
# AUDIO PROCESSING
# ==============================

def extract_audio(file_path: str):
    audio = AudioSegment.from_file(file_path)
    audio = audio.set_channels(1)

    samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
    samples = samples / (2**15)

    return samples, audio.frame_rate


def save_samples_to_wav(samples, rate, output_path):
    samples = np.clip(samples, -1, 1)
    samples_int = (samples * (2**15)).astype(np.int16)

    audio = AudioSegment(
        samples_int.tobytes(),
        frame_rate=rate,
        sample_width=2,
        channels=1
    )

    audio.export(output_path, format="wav")


# ==============================
# DCT EMBEDDING
# ==============================

def embed_dct(samples, bits):
    output = samples.copy()
    num_frames = len(samples) // FRAME_SIZE

    if num_frames < len(bits):
        raise Exception("Audio too short for watermark.")

    for i, bit in enumerate(bits):
        start = i * FRAME_SIZE
        end = start + FRAME_SIZE
        frame = samples[start:end]

        coeffs = dct(frame, norm="ortho")
        idx = FRAME_SIZE // 3

        coeffs[idx] = abs(coeffs[idx]) + ALPHA if bit else -abs(coeffs[idx]) - ALPHA
        output[start:end] = idct(coeffs, norm="ortho")

    return output


def extract_dct(samples, length):
    bits = []
    num_frames = len(samples) // FRAME_SIZE

    for i in range(min(num_frames, length)):
        start = i * FRAME_SIZE
        end = start + FRAME_SIZE
        frame = samples[start:end]

        coeffs = dct(frame, norm="ortho")
        idx = FRAME_SIZE // 3
        bits.append(1 if coeffs[idx] > 0 else 0)

    return bits


# ==============================
# MAIN EMBED FUNCTION
# ==============================

def embed_watermark(file_bytes: bytes, user_id: str, content_id: str):
    with tempfile.TemporaryDirectory() as temp_dir:

        input_path = os.path.join(temp_dir, "input.mp4")
        with open(input_path, "wb") as f:
            f.write(file_bytes)

        # First check if already watermarked
        if detect_watermark(file_bytes):
            raise Exception("File already contains watermark.")

        # Extract audio
        audio_path = os.path.join(temp_dir, "audio.wav")

        subprocess.run(
            ["ffmpeg", "-y", "-i", input_path, "-vn", "-acodec", "pcm_s16le", audio_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        samples, rate = extract_audio(audio_path)

        timestamp = datetime.now(timezone.utc).isoformat()
        watermark_id = generate_watermark_id(user_id, content_id, timestamp)

        full_text = WATERMARK_SIGNATURE + watermark_id
        bits = string_to_binary(full_text)

        watermarked_samples = embed_dct(samples, bits)

        watermarked_audio_path = os.path.join(temp_dir, "watermarked.wav")
        save_samples_to_wav(watermarked_samples, rate, watermarked_audio_path)

        # Merge audio back into video
        output_video_path = os.path.join(temp_dir, "output.mp4")

        subprocess.run(
            [
                "ffmpeg",
                "-y",
                "-i", input_path,
                "-i", watermarked_audio_path,
                "-c:v", "copy",
                "-map", "0:v:0",
                "-map", "1:a:0",
                output_video_path
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        with open(output_video_path, "rb") as f:
            output_bytes = f.read()

    return output_bytes, watermark_id


# ==============================
# MAIN DETECT FUNCTION
# ==============================

def detect_watermark(file_bytes: bytes) -> Optional[str]:
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as temp:
            temp.write(file_bytes)
            temp_path = temp.name

        audio_path = temp_path + ".wav"

        subprocess.run(
            ["ffmpeg", "-y", "-i", temp_path, "-vn", "-acodec", "pcm_s16le", audio_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True
        )

        samples, _ = extract_audio(audio_path)

        length = len(string_to_binary(WATERMARK_SIGNATURE + "0"*16))
        bits = extract_dct(samples, length)

        text = binary_to_string(bits)

        os.remove(temp_path)
        os.remove(audio_path)

        if text.startswith(WATERMARK_SIGNATURE):
            return text.replace(WATERMARK_SIGNATURE, "")

        return None

    except:
        return None
