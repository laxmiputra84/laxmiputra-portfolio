import os
import shutil
from app.database import engine
from sqlalchemy import text

def sync():
    resume_dir = "app/uploads/resume"
    files = os.listdir(resume_dir)
    print("Files on disk:", files)
    
    with engine.connect() as conn:
        res = conn.execute(text("SELECT id, title, file_name, file_path FROM resumes"))
        rows = res.fetchall()
        print("Database rows:")
        for r in rows:
            print(f"ID: {r[0]}, Title: {r[1]}, Original Name: {r[2]}, Path in DB: {r[3]}")
            db_path = r[3]
            db_filename = os.path.basename(db_path)
            
            # If the database filename does not exist, but we have a pdf in the folder, let's copy it or update the db
            if db_filename not in files:
                if len(files) == 1:
                    actual_file = files[0]
                    src = os.path.join(resume_dir, actual_file)
                    dst = os.path.join(resume_dir, db_filename)
                    print(f"Copying {src} -> {dst}")
                    shutil.copy(src, dst)
                    print("Copy successful!")
                else:
                    print("Multiple files or no files on disk. Cannot auto-copy.")

if __name__ == "__main__":
    sync()
