from fastapi import FastAPI
from pydantic import BaseModel
import pygame.midi

# Initialize FastAPI app
app = FastAPI()

# Initialize pygame MIDI
pygame.midi.init()
midi_output = pygame.midi.Output(0)

# Track the current instrument
current_instrument = 0
midi_output.set_instrument(current_instrument)

# Pydantic model for note playback
class PlayNoteRequest(BaseModel):
    note: int       # MIDI note number (e.g., 60 for Middle C)
    instrument: int # 0–127 (General MIDI instruments)

@app.post("/play")
def play_note(data: PlayNoteRequest):
    global current_instrument
    if data.instrument != current_instrument:
        midi_output.set_instrument(data.instrument)
        current_instrument = data.instrument

    midi_output.note_on(data.note, 127)
    return {"status": "playing", "note": data.note, "instrument": data.instrument}

@app.post("/stop")
def stop_note(data: PlayNoteRequest):
    midi_output.note_off(data.note, 127)
    return {"status": "stopped", "note": data.note}
