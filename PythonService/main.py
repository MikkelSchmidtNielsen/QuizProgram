import os
import whisper

model = whisper.load_model('base')

audio_file = 'path'

result = model.transcribe()

print(result['text'])