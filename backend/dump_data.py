import json
from app.database import engine
from sqlalchemy import text

def dump():
    tables = [
        "users", "settings", "projects", "skills",
        "experiences", "education", "certificates",
        "social_links", "resumes", "services"
    ]
    data = {}
    with engine.connect() as conn:
        for t in tables:
            try:
                res = conn.execute(text(f"SELECT * FROM `{t}`"))
                keys = res.keys()
                rows = [dict(zip(keys, row)) for row in res.fetchall()]
                # Convert datetime objects to string
                for row in rows:
                    for k, v in row.items():
                        if hasattr(v, "isoformat"):
                            row[k] = v.isoformat()
                data[t] = rows
            except Exception as e:
                data[t] = f"Error: {e}"
    print(json.dumps(data, indent=2))

if __name__ == "__main__":
    dump()
