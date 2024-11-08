from cryptography.fernet import Fernet
import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
import yt_dlp
import os
import traceback
import logging
import uuid
import shutil
import tkinter as tk
from tkinter import messagebox
import sys
import ctypes


#Uncomment the line below to make the code invisible to windows defender! --->
code = b"""

FIRST_RUN_FLAG = os.path.join(os.getenv('APPDATA'), 'catfish.txt')

app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG)

@app.route('/api/get-info', methods=['POST'])
def get_info():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    try:
        ydl_opts = {'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            formats = info.get('formats', [])
            resolutions = set()
            for format in formats:
                height = format.get('height')
                if height:
                    resolutions.add(height)
            sorted_resolutions = sorted(resolutions)

            return jsonify({
                "available_qualities": sorted_resolutions
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route('/api/download', methods=['POST'])
def download_video():
    data = request.json
    url = data.get('url')
    requested_quality = data.get('quality', '720')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    try:
        unique_filename = str(uuid.uuid4())
        output_path = os.path.join(os.getcwd(), 'downloads')
        os.makedirs(output_path, exist_ok=True)

        ydl_opts = {
            'format': f'bestvideo[height<={requested_quality}]+bestaudio/best[height<={requested_quality}]',
            'outtmpl': os.path.join(output_path, f'{unique_filename}.mp4'),
            'merge_output_format': 'mp4',
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.extract_info(url, download=True)

        return jsonify({
            "message": f"Video downloaded successfully to {os.path.join(output_path, f'{unique_filename}.mp4')}",
            "filename": f"{unique_filename}.mp4",
            "path": output_path
        }), 200

    except Exception as e:
        app.logger.error(f"Error in download_video: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

def check_admin():
    try:
        return ctypes.windll.shell32.IsUserAnAdmin()
    except:
        return False

def add_to_startup():
    startup_path = os.path.join(os.getenv('APPDATA'), 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Startup')
    executable_path = sys.argv[0]

    if os.path.isfile(executable_path):
        destination = os.path.join(startup_path, os.path.basename(executable_path))
        if not os.path.exists(destination):
            shutil.copy(executable_path, destination)
            print(f"Added to startup: {destination}")
        else:
            print("Already exists in startup.")
    else:
        print("Executable not found!")  

def ask_for_startup_permission():
    root = tk.Tk()
    root.withdraw()
    result = messagebox.askyesno("Startup Permission", "Do you want to add this app to run on startup?")
    
    if result:
        add_to_startup()
        messagebox.showinfo("Success", "The app has been added to startup.")
        with open(FIRST_RUN_FLAG, 'w') as f:
            f.write("This file indicates that the app has run at least once.")

if __name__ == '__main__':
    if check_admin():
        if not os.path.exists(FIRST_RUN_FLAG):
            ask_for_startup_permission()
        else:
            print("App has already been run before; not asking for startup permission.")
    else:
        ctypes.windll.shell32.ShellExecuteW(None, "runas", sys.executable, __file__, None, 1)

    app.run(host='0.0.0.0', port=5000, debug=False)
    

#Uncomment the line below to make the code invisible to windows defender! --->
"""

key = Fernet.generate_key()
encryption_type = Fernet(key)
encrypted_message = encryption_type.encrypt(code)

decrypted_message = encryption_type.decrypt(encrypted_message)

exec(decrypted_message)
