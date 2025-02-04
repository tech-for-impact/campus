from pydantic import BaseModel
import random
import string
from typing import Dict

class Team(BaseModel):
    name: str
    selected_bag: int = None
    bag_contents: Dict[str, int] = None

class CreateRoomRequest(BaseModel):
    host_nickname: str

class Room(BaseModel):
    code: str
    host_nickname: str
    teams: Dict[str, Team] = {}
    game_info: Dict = None
    current_phase: str = "waiting" # waiting, bag_selection, game_info, bag_packing, scenario

class Participant(BaseModel):
    team_name: str

game_rooms = {}

def generate_room_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6)) 