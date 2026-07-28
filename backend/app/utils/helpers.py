from datetime import datetime

def format_datetime(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def parse_comma_separated(val: str) -> list:
    if not val:
        return []
    return [item.strip() for item in val.split(",") if item.strip()]
