import pymysql
from app.config import settings
from app.database import engine

def main():
    print("Testing database connection...")
    
    # First, let's try to connect to MySQL server without db name to verify server is running and create db if needed
    try:
        conn = pymysql.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD
        )
        cursor = conn.cursor()
        print(f"Connected to MySQL server at {settings.DB_HOST}:{settings.DB_PORT}")
        
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME}")
        print(f"Database '{settings.DB_NAME}' verified/created successfully.")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Could not connect to MySQL server directly: {e}")

    # Now, test SQLAlchemy connection
    try:
        with engine.connect() as connection:
            print("SQLAlchemy database connection successful!")
            return True
    except Exception as e:
        print(f"SQLAlchemy connection failed: {e}")
        return False

if __name__ == "__main__":
    main()
