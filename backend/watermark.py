import hashlib
import numpy as np
from scipy.fftpack import dct, idct
from pydub import AudioSegment
import io
from datetime import datetime
from typing import Tuple, Optional

def generate_watermark_id(user_id: str, content_id: str, timestamp: str) -> str:
    """Generate unique watermark identifier using hash function"""
    data = f"{user_id}||{content_id}||{timestamp}"
    return hashlib.sha256(data.encode()).hexdigest()

def string_to_binary(watermark_id: str) -> list:
    """Convert watermark ID to binary bit sequence"""
    binary_bits = []
    for char in watermark_id[:32]:
        binary_bits.extend([int(b) for b in format(ord(char), '08b')])
    return binary_bits

def binary_to_string(binary_bits: list) -> str:
    """Convert binary bit sequence back to string"""
    chars = []
    for i in range(0, len(binary_bits), 8):
        byte = binary_bits[i:i+8]
        if len(byte) == 8:
            chars.append(chr(int(''.join(map(str, byte)), 2)))
    return ''.join(chars)

def extract_audio_from_file(file_bytes: bytes) -> Tuple[np.ndarray, int]:
    """Extract audio from file and convert to WAV format"""
    audio = AudioSegment.from_file(io.BytesIO(file_bytes))
    
    audio = audio.set_channels(1)
    
    samples = np.array(audio.get_array_of_samples(), dtype=np.float32)
    samples = samples / (2**15)
    
    return samples, audio.frame_rate

def embed_watermark_dct(audio_samples: np.ndarray, watermark_bits: list, frame_size: int = 1024, alpha: float = 0.1) -> np.ndarray:
    """Embed watermark using DCT (Discrete Cosine Transform)"""
    watermarked_samples = audio_samples.copy()
    num_frames = len(audio_samples) // frame_size
    bits_per_frame = len(watermark_bits) // num_frames if num_frames > 0 else len(watermark_bits)
    
    if bits_per_frame == 0:
        bits_per_frame = 1
    
    bit_index = 0
    
    for i in range(num_frames):
        if bit_index >= len(watermark_bits):
            break
            
        start_idx = i * frame_size
        end_idx = start_idx + frame_size
        frame = audio_samples[start_idx:end_idx]
        
        dct_coeffs = dct(frame, norm='ortho')
        
        mid_freq_start = frame_size // 4
        mid_freq_end = frame_size // 2
        
        for j in range(bits_per_frame):
            if bit_index >= len(watermark_bits):
                break
                
            coeff_idx = mid_freq_start + (j % (mid_freq_end - mid_freq_start))
            
            if watermark_bits[bit_index] == 1:
                dct_coeffs[coeff_idx] += alpha * abs(dct_coeffs[coeff_idx])
            else:
                dct_coeffs[coeff_idx] -= alpha * abs(dct_coeffs[coeff_idx])
            
            bit_index += 1
        
        watermarked_frame = idct(dct_coeffs, norm='ortho')
        watermarked_samples[start_idx:end_idx] = watermarked_frame
    
    return watermarked_samples

def extract_watermark_dct(audio_samples: np.ndarray, watermark_length: int = 256, frame_size: int = 1024, alpha: float = 0.1) -> list:
    """Extract watermark from audio using DCT"""
    num_frames = len(audio_samples) // frame_size
    bits_per_frame = watermark_length // num_frames if num_frames > 0 else watermark_length
    
    if bits_per_frame == 0:
        bits_per_frame = 1
    
    extracted_bits = []
    
    for i in range(num_frames):
        if len(extracted_bits) >= watermark_length:
            break
            
        start_idx = i * frame_size
        end_idx = start_idx + frame_size
        frame = audio_samples[start_idx:end_idx]
        
        dct_coeffs = dct(frame, norm='ortho')
        
        mid_freq_start = frame_size // 4
        mid_freq_end = frame_size // 2
        
        for j in range(bits_per_frame):
            if len(extracted_bits) >= watermark_length:
                break
                
            coeff_idx = mid_freq_start + (j % (mid_freq_end - mid_freq_start))
            
            if coeff_idx + 1 < len(dct_coeffs):
                if dct_coeffs[coeff_idx] > 0:
                    extracted_bits.append(1)
                else:
                    extracted_bits.append(0)
    
    return extracted_bits[:watermark_length]

def samples_to_audio_bytes(samples: np.ndarray, sample_rate: int, format: str = "wav") -> bytes:
    """Convert audio samples back to audio file bytes"""
    samples = np.clip(samples, -1.0, 1.0)
    samples_int = (samples * (2**15)).astype(np.int16)
    
    audio = AudioSegment(
        samples_int.tobytes(),
        frame_rate=sample_rate,
        sample_width=2,
        channels=1
    )
    
    output = io.BytesIO()
    audio.export(output, format=format)
    output.seek(0)
    return output.read()

def embed_watermark(file_bytes: bytes, user_id: str, content_id: str) -> Tuple[bytes, str]:
    """Main function to embed watermark in audio file"""
    timestamp = datetime.utcnow().isoformat()
    
    watermark_id = generate_watermark_id(user_id, content_id, timestamp)
    
    watermark_bits = string_to_binary(watermark_id)
    
    audio_samples, sample_rate = extract_audio_from_file(file_bytes)
    
    watermarked_samples = embed_watermark_dct(audio_samples, watermark_bits)
    
    watermarked_bytes = samples_to_audio_bytes(watermarked_samples, sample_rate)
    
    return watermarked_bytes, watermark_id

def detect_watermark(file_bytes: bytes) -> Optional[str]:
    """Main function to detect and extract watermark from audio file"""
    try:
        audio_samples, sample_rate = extract_audio_from_file(file_bytes)
        
        extracted_bits = extract_watermark_dct(audio_samples, watermark_length=256)
        
        watermark_id = binary_to_string(extracted_bits)
        
        if watermark_id and len(watermark_id) > 0:
            return watermark_id
        return None
    except Exception as e:
        print(f"Error detecting watermark: {e}")
        return None
