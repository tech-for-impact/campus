# DEPRECATED -> host.py, player.py

# from fastapi import APIRouter, HTTPException
# from pydantic import BaseModel
# import random
# import string
# from typing import Dict

# router = APIRouter()

# game_rooms = {}

# class Team(BaseModel):
#     name: str
#     selected_bag: int = None  # 선택한 가방 번호를 저장할 필드

# class Room(BaseModel):
#     code: str
#     teams: Dict[str, Team] = {}
#     game_info: Dict = None  # 게임 사전 정보를 저장할 필드

# class Participant(BaseModel):
#     team_name: str

# def generate_room_code():
#     return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# @router.get("/example")
# async def example_api():
#     return {"메시지": "이것은 예시 API 메서드입니다."}

# @router.post("/create_room")
# async def create_room():
#     room_code = generate_room_code()
#     while room_code in game_rooms:
#         room_code = generate_room_code()
#     game_rooms[room_code] = Room(code=room_code)
#     return {"room_code": room_code}

# @router.post("/join_room/{room_code}")
# async def join_room(room_code: str, participant: Participant):
#     if room_code not in game_rooms:
#         raise HTTPException(status_code=404, detail="방을 찾을 수 없습니다")
#     room = game_rooms[room_code]
    
#     if participant.team_name in room.teams:
#         raise HTTPException(status_code=400, detail="이미 존재하는 팀 이름입니다")
    
#     room.teams[participant.team_name] = Team(name=participant.team_name)
#     return {"message": f"{participant.team_name} 팀이 방에 참가했습니다", 
#             "team": participant.team_name}

# @router.get("/room/{room_code}")
# async def get_room_info(room_code: str):
#     if room_code not in game_rooms:
#         raise HTTPException(status_code=404, detail="방을 찾을 수 없습니다")
#     room = game_rooms[room_code]
#     return {
#         "room_code": room.code,
#         "teams": [team.name for team in room.teams.values()]
#     }

# @router.get("/rooms")
# async def get_all_rooms():
#     return {
#         "rooms": [
#             {
#                 "room_code": room.code,
#                 "teams_count": len(room.teams)
#             } for room in game_rooms.values()
#         ]
#     }

# @router.post("/room/{room_code}/game_info")
# async def set_game_info(room_code: str, game_info: Dict):
#     if room_code not in game_rooms:
#         raise HTTPException(status_code=404, detail="방을 찾을 수 없습니다")
    
#     room = game_rooms[room_code]
#     room.game_info = game_info
#     return {"message": "게임 정보가 성공적으로 업로드되었습니다", "game_info": game_info}

# @router.post("/room/{room_code}/team/{team_name}/select_bag")
# async def select_bag(room_code: str, team_name: str, bag_number: int):
#     if room_code not in game_rooms:
#         raise HTTPException(status_code=404, detail="방을 찾을 수 없습니다")
    
#     room = game_rooms[room_code]
#     if team_name not in room.teams:
#         raise HTTPException(status_code=404, detail="팀을 찾을 수 없습니다")
    
#     if bag_number not in [1, 2, 3]:
#         raise HTTPException(status_code=400, detail="유효하지 않은 가방 번호입니다")
    
#     room.teams[team_name].selected_bag = bag_number
#     return {"message": f"{team_name} 팀이 {bag_number}번 가방을 선택했습니다"}

# @router.get("/room/{room_code}/team_selections")
# async def get_team_selections(room_code: str):
#     if room_code not in game_rooms:
#         raise HTTPException(status_code=404, detail="방을 찾을 수 없습니다")
    
#     room = game_rooms[room_code]
#     team_selections = {
#         team_name: team.selected_bag 
#         for team_name, team in room.teams.items()
#     }
#     return {"team_selections": team_selections}


