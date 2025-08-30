# Coffee Shop Backend API

## Project Description
This project implements a **Coffee Shop Backend** with:
- RESTful API (Flask, SQLAlchemy)
- SQLite database
- Authentication & Authorization using **Auth0**
- CRUD operations for Drinks

## Setup

### 1. Clone repository & install dependencies
```bash
git clone <REPO_URL>
cd starter_code/backend
python -m venv .venv
.venv\Scripts\activate    # (Windows PowerShell)
pip install -r requirements.txt

2. Configure environment

Set Flask environment variable:

$env:FLASK_APP = "src.api"


(For Linux/macOS:)

export FLASK_APP=src.api

3. Initialize database
python
>>> from src.api import app
>>> from src.database.models import db_drop_and_create_all
>>> with app.app_context():
...     db_drop_and_create_all()
...
exit()

4. Run the server
flask run --reload


Server runs at:
http://127.0.0.1:5000

Endpoints
Public

GET /drinks – returns drink.short()

Protected (requires JWT)

GET /drinks-detail – returns drink.long(), requires get:drinks-detail

POST /drinks – creates a new drink, requires post:drinks

PATCH /drinks/<id> – updates an existing drink, requires patch:drinks

DELETE /drinks/<id> – deletes a drink, requires delete:drinks

Authentication (Auth0)

Domain: dev-nz2uujp47cdujste.us.auth0.com

API Audience: coffee

Algorithm: RS256

Tokens are generated using the Client Credentials Flow.

Postman

Import the collection: coffee_shop.postman_collection.json

Environment variables:

base_url = http://127.0.0.1:5000

token = <YOUR_JWT>

Reviewer Notes

Please reset the DB first (see step 3).

Import the Postman collection and test endpoints.

A valid JWT is already included in the Postman collection (if not expired).
If expired: generate a new token using the Client Credentials Flow.