import os
import whisper

def say_hello():
    return "Hello world! I'm a python script"

def test(message):
    directory = os.getcwd()
    return message + ": " + directory

# model = whisper.load_model('base')

# audio_file = 'path'

# result = model.transcribe()

# print(result['text'])