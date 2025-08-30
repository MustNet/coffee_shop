from src.api import app
from src.database.models import db_drop_and_create_all

with app.app_context():
    db_drop_and_create_all()
    print("DB reset OK")

