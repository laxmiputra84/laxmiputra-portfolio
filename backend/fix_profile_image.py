import os
import shutil
from app.database import engine
from sqlalchemy import text

def fix():
    uploads_dir = "app/uploads"
    files = os.listdir(uploads_dir)
    print("Files in app/uploads:", files)
    
    # Let's copy one of the jpeg files to the expected name
    target_name = "8f98f1e3-ac4a-41b0-a3b5-ea9f2dae95b7.jpeg"
    if target_name not in files:
        jpeg_files = [f for f in files if f.endswith(".jpeg")]
        if jpeg_files:
            src = os.path.join(uploads_dir, jpeg_files[0])
            dst = os.path.join(uploads_dir, target_name)
            print(f"Copying {src} -> {dst}")
            shutil.copy(src, dst)
            print("Copy successful!")
            
    # Let's also check the settings table
    with engine.connect() as conn:
        res = conn.execute(text("SELECT id, profile_image FROM settings"))
        row = res.fetchone()
        if row:
            print(f"Current profile_image in DB: {row[1]}")
            # If it uses an old domain, we can replace the domain or set it to relative path or a direct localhost URL if in dev
            # Let's update the DB setting to use a relative upload path or correct url if needed.
            # But wait, let's see if updating the DB to use a local or relative url works better:
            # Let's print out what is there.

if __name__ == "__main__":
    fix()
