import os
from dotenv import load_dotenv
import json

import discord
from discord import app_commands
from discord.ext import commands
import requests


app_commands.Choice(name='Easy', value='Easy')

load_dotenv()
url = os.environ.get('BACKEND_URL')
token = os.environ.get('TOKEN')
invis = " ‎ "
client = commands.Bot(command_prefix='!', intents=discord.Intents.all())

@client.event
async def on_ready():
    print('Connected to Discord!')
    await client.tree.sync()

class JoinButton(discord.ui.View):
    def __init__(self, id):
        super().__init__()
        button = discord.ui.Button(label='Join', style=discord.ButtonStyle.green, url=f'http://versussweeper.com/{id}')
        self.add_item(button)

        


@client.tree.command(name='ping', description='Pong!!!!')
async def ping(interaction: discord.Interaction):
    member = interaction.user

    red = discord.Color.red()
    embed = discord.Embed(title="Easy Game", description="ID: 34422", color=red, url="https://www.google.com/")
    embed.set_author(name=member.name, icon_url=member.avatar, url="https://www.google.com/")
    embed.set_thumbnail(url="https://e7.pngegg.com/pngimages/726/613/png-clipart-minesweeper-go-classic-mines-game-cannon-shoot-game-fabulous-bubbles-android-game-angle.png")
    embed.add_field(name="Rows", value="12", inline=True)
    embed.add_field(name="Columns", value="12", inline=True)
    embed.add_field(name="Mines", value="12", inline=True)
    embed.add_field(name="Max Players", value="10", inline=True)
    embed.add_field(name="Stun Duration", value="10", inline=True)
    embed.add_field(name="Disable Flag", value="False", inline=True)
    embed.add_field(name="Disable Middle Mouse", value="False", inline=True)
    embed.add_field(name="Random Seed", value="False", inline=True)
    embed.add_field(name="Seed", value="34224", inline=True)
    await  interaction.response.send_message(embed=embed, view=JoinButton(34422))

@client.tree.command(name='list', description='List of public games')
@app_commands.choices(difficulty=[app_commands.Choice(name='Easy', value='Easy'), app_commands.Choice(name='Medium', value='Medium'), app_commands.Choice(name='Hard', value='Hard'), app_commands.Choice(name='Custom', value='Custom')])
async def ping(interaction: discord.Interaction, difficulty: str):
    if difficulty == 'Easy':
        num = 0
    elif difficulty == 'Medium':
        num = 1
    elif difficulty == 'Hard':
        num = 2
    elif difficulty == 'Custom':
        num = 3
    data = {"difficulty": num}
    response = requests.post(f'{url}/publicGames', json=data)

    if response.status_code == 200:
        filtered_games = response.json()["filteredGames"]
        num_games = filtered_games[0]
        if num_games == 0:
            embed = discord.Embed(title=f"Public {difficulty} Games", description="No games found", color=discord.Color.green(), url="https://versussweeper.com/games")
            embed.set_thumbnail(url="https://e7.pngegg.com/pngimages/726/613/png-clipart-minesweeper-go-classic-mines-game-cannon-shoot-game-fabulous-bubbles-android-game-angle.png")
            embed.add_field(name="Create a new game with /create_default or /create_custom!", value = "", inline=False)    
            await interaction.response.send_message(embed=embed)

        else:
            embed = discord.Embed(title=f"Public {difficulty} Games", description=(f"{num_games} game" + ("s" if num_games > 1 else "") +" found" + ("" if num_games <= 8 else ". 8 listed" )), color=discord.Color.green(), url="https://versussweeper.com/games")
            embed.set_thumbnail(url="https://e7.pngegg.com/pngimages/726/613/png-clipart-minesweeper-go-classic-mines-game-cannon-shoot-game-fabulous-bubbles-android-game-angle.png")
            for i in range(min(8, num_games)):
                id = filtered_games[i*2 + 1][5:]
                game_info = json.loads(filtered_games[i*2 + 2][1])
                player_limit = game_info["playerLimit"]
                num_players = len(game_info["players"])
                game_started = game_info["gameStarted"]
                # embed.add_field(name=f"Game {i}", value=f"ID: {id} Players: {num_players}/{player_limit}\t Started: {game_started}", inline=False)
                embed.add_field(name=id, value="")
                embed.add_field(name = (invis * 12) + f'{num_players}/{player_limit} Players' + (invis* 12), value = "")
                embed.add_field(name = "In Game" if game_started else "In Lobby", value ="")
            await interaction.response.send_message(embed=embed)
        
    else:
        print(response.text)


@client.tree.command(name='create_default', description='Create a new game!')
@app_commands.choices(difficulty=[app_commands.Choice(name='Easy', value='Easy'), app_commands.Choice(name='Medium', value='Medium'), app_commands.Choice(name='Hard', value='Hard')])
@app_commands.choices(visibility=[app_commands.Choice(name='Public', value='Public'), app_commands.Choice(name='Private', value='Private')])
@app_commands.choices(stun_duration=[app_commands.Choice(name='0', value='0'), app_commands.Choice(name='3', value='3'), app_commands.Choice(name='5', value='5'), app_commands.Choice(name='10', value='10'), app_commands.Choice(name='15', value='15'), app_commands.Choice(name='30', value='30'), app_commands.Choice(name='60', value='60')])
@app_commands.choices(max_players=[app_commands.Choice(name='1', value='1'),app_commands.Choice(name='2', value='2'), app_commands.Choice(name='3', value='3'), app_commands.Choice(name='4', value='4'), app_commands.Choice(name='5', value='5'), app_commands.Choice(name='6', value='6'), app_commands.Choice(name='7', value='7'), app_commands.Choice(name='8', value='8'), app_commands.Choice(name='9', value='9'), app_commands.Choice(name='10', value='10')])
@app_commands.choices(disable_flag=[app_commands.Choice(name='False', value='False'), app_commands.Choice(name='True', value='True')])
@app_commands.choices(disable_middle_mouse=[app_commands.Choice(name='False', value='False'), app_commands.Choice(name='True', value='True')])
async def create_default(interaction: discord.Interaction, difficulty: str, visibility: str, stun_duration: str, max_players: str, disable_flag: str, disable_middle_mouse: str, seed: str = ""):
    try:
        if seed != "":
            int(seed)
        if len(seed) > 10:
            raise Exception('Invalid seed! Seed must be a number less than 10 digits long!')
    except:
        await interaction.response.send_message('Invalid seed! Seed must be a number less than 10 digits long!')
        return
    
    if difficulty == 'Easy':
        rows = 9
        columns = 9
        mines = 10
        num = 0
        color = discord.Color.green()
    elif difficulty == 'Medium':
        rows = 16
        columns = 16
        mines = 40
        num = 1
        color = discord.Color.orange()
    elif difficulty == 'Hard':
        rows = 16
        columns = 30
        mines = 99
        num = 2
        color = discord.Color.red()
    
    data = {
        "difficulty": num,
        "rows": int(rows),
        "cols": int(columns),
        "mines": int(mines),
        "stunDuration": int(stun_duration),
        "playerLimit": int(max_players),
        "disableFlag": disable_flag == 'True',
        "disableMiddleMouse": disable_middle_mouse == 'True',
        "seed": seed,
        "publicRoom": visibility == 'Public'
    }
    response = requests.post(f'{url}/create', json=data)
    if response.status_code == 200:
        id = response.json()['id']
        member = interaction.user

        embed = discord.Embed(title=f"{difficulty} Game", description=f"ID: {id}", color=color, url=f"https://versussweeper.com/{id}")
        embed.set_author(name=member.name, icon_url=member.avatar, url=f"https://versussweeper.com/{id}")
        embed.set_thumbnail(url="https://e7.pngegg.com/pngimages/726/613/png-clipart-minesweeper-go-classic-mines-game-cannon-shoot-game-fabulous-bubbles-android-game-angle.png")
        embed.add_field(name="Rows", value=rows, inline=True)
        embed.add_field(name="Columns", value=columns, inline=True)
        embed.add_field(name="Mines", value=mines, inline=True)
        embed.add_field(name="Max Players", value=max_players, inline=True)
        embed.add_field(name="Stun Duration", value=stun_duration, inline=True)
        embed.add_field(name="Disable Flag", value=disable_flag, inline=True)
        embed.add_field(name="Disable Middle Mouse", value=disable_middle_mouse, inline=True)
        embed.add_field(name="Random Seed", value=(seed == ""), inline=True)

        if seed != "":
            embed.add_field(name="Seed", value=seed, inline=True)
        await interaction.response.send_message(embed=embed, view=JoinButton(id))
    else:
        await interaction.response.send_message('Game creation failed! ' + str(response.json()))


@client.tree.command(name='create_custom', description='Create a new custom game!')
@app_commands.choices(visibility=[app_commands.Choice(name='Public', value='Public'), app_commands.Choice(name='Private', value='Private')])
@app_commands.choices(stun_duration=[app_commands.Choice(name='0', value='0'), app_commands.Choice(name='3', value='3'), app_commands.Choice(name='5', value='5'), app_commands.Choice(name='10', value='10'), app_commands.Choice(name='15', value='15'), app_commands.Choice(name='30', value='30'), app_commands.Choice(name='60', value='60')])
@app_commands.choices(max_players=[app_commands.Choice(name='1', value='1'),app_commands.Choice(name='2', value='2'), app_commands.Choice(name='3', value='3'), app_commands.Choice(name='4', value='4'), app_commands.Choice(name='5', value='5'), app_commands.Choice(name='6', value='6'), app_commands.Choice(name='7', value='7'), app_commands.Choice(name='8', value='8'), app_commands.Choice(name='9', value='9'), app_commands.Choice(name='10', value='10')])
@app_commands.choices(disable_flag=[app_commands.Choice(name='False', value='False'), app_commands.Choice(name='True', value='True')])
@app_commands.choices(disable_middle_mouse=[app_commands.Choice(name='False', value='False'), app_commands.Choice(name='True', value='True')])
async def create_custom(interaction: discord.Interaction, rows: str, columns: str, mines: str, visibility: str, stun_duration: str, max_players: str, disable_flag: str, disable_middle_mouse: str, seed: str = ""):
    try:
        if seed != "":
            int(seed)
        if len(seed) > 10:
            raise Exception('Invalid seed!')
    except:
        await interaction.response.send_message('Invalid seed! Seed must be a number less than 10 digits long!')
        return
    try:
        if int(rows) > 20 or int(rows) < 5:
            raise Exception('Invalid rows!')
    except:
        await interaction.response.send_message('Invalid rows! Rows must be between 5 and 20!')
        return
    try:
        if int(columns) > 40 or int(columns) < 5:
            raise Exception('Invalid columns!')
    except:
        await interaction.response.send_message('Invalid columns! Columns must be between 5 and 40!')
        return
    try:
        if int(mines) > (int(rows) * int(columns))/4:
            raise Exception('Invalid mines!')
    except:
        await interaction.response.send_message('Invalid mines! Mines must be less than 1/4 of the total number of tiles!')
        return
    
    data = {
        "difficulty": 3,
        "rows": int(rows),
        "cols": int(columns),
        "mines": int(mines),
        "stunDuration": int(stun_duration),
        "playerLimit": int(max_players),
        "disableFlag": disable_flag == 'True',
        "disableMiddleMouse": disable_middle_mouse == 'True',
        "seed": seed,
        "publicRoom": visibility == 'Public'
    }
    response = requests.post(f'{url}/create', json=data)
    if response.status_code == 200:
        id = response.json()['id']
        member = interaction.user

        embed = discord.Embed(title="Custom Game", description=f"ID: {id}", color=discord.Color.blue(), url=f"https://versussweeper.com/{id}")
        embed.set_author(name=member.name, icon_url=member.avatar, url=f"https://versussweeper.com/{id}")
        embed.set_thumbnail(url="https://e7.pngegg.com/pngimages/726/613/png-clipart-minesweeper-go-classic-mines-game-cannon-shoot-game-fabulous-bubbles-android-game-angle.png")
        embed.add_field(name="Rows", value=rows, inline=True)
        embed.add_field(name="Columns", value=columns, inline=True)
        embed.add_field(name="Mines", value=mines, inline=True)
        embed.add_field(name="Max Players", value=max_players, inline=True)
        embed.add_field(name="Stun Duration", value=stun_duration, inline=True)
        embed.add_field(name="Disable Flag", value=disable_flag, inline=True)
        embed.add_field(name="Disable Middle Mouse", value=disable_middle_mouse, inline=True)
        embed.add_field(name="Random Seed", value=(seed == ""), inline=True)
        if seed != "":
            embed.add_field(name="Seed", value=seed, inline=True)
        await interaction.response.send_message(embed=embed, view=JoinButton(id))

    else:
        await interaction.response.send_message('Game creation failed! ' + str(response.json()))




client.run(token)
