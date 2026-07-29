from app.database import engine
from sqlalchemy import text

def check():
    with engine.connect() as conn:
        res = conn.execute(text("SHOW DATABASES"))
        print("Databases:", [row[0] for row in res.fetchall()])

if __name__ == "__main__":
    check()
