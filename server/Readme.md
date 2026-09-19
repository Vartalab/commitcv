# GitHub Profile Engine

A type-safe backend engine that fetches public GitHub profile information and converts it into a consistent portfolio-ready response.

The engine is designed to be consumed by the web application without requiring the client to directly handle or parse GitHub API responses.

## Features

* Fetch GitHub profile information
* Fetch repositories
* Identify top repositories by stars
* Calculate overall language usage percentages
* Fetch GitHub contribution totals
* Support multiple contribution periods
* Support custom contribution date ranges
* Validate GitHub API responses
* Return consistent structured errors
* Runtime validation using Pydantic
* Automated tests using pytest

## Tech Stack

* Python
* FastAPI
* Pydantic
* Requests
* GitHub REST API
* GitHub GraphQL API
* pytest

## Project Structure

```text
portfolio-engine/
├── .env
├── .gitignore
├── app.py
├── engine.py
├── models.py
├── requirements.txt
├── test_engine.py
└── README.md
```

## Setup

### 1. Create a virtual environment

```bash
python -m venv venv
```

### 2. Activate the virtual environment

Windows PowerShell:

```powershell
.\venv\Scripts\Activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

## GitHub Token

The engine uses a GitHub token for authenticated API requests.

Create a `.env` file in the project root:

```env
GITHUB_TOKEN=your_github_token_here
```

Do not commit the `.env` file to GitHub.

## Running the Server

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

## API Endpoint

### Generate Portfolio

```text
POST /generate
```

### Example Request

```json
{
    "username": "HamidSiddiqui12",
    "include_repositories": true,
    "include_languages": true,
    "include_contributions": true,
    "contribution_period": "1_year"
}
```

## Contribution Periods

The engine supports the following contribution periods:

| Period      | Description                        |
| ----------- | ---------------------------------- |
| `30_days`   | Last 30 days                       |
| `3_months`  | Last 3 months                      |
| `6_months`  | Last 6 months                      |
| `1_year`    | Last 1 year                        |
| `this_year` | From January 1 of the current year |
| `custom`    | User-defined start and end dates   |

For a custom period, provide:

```json
{
    "contribution_period": "custom",
    "contribution_start": "2026-08-01",
    "contribution_end": "2026-08-31"
}
```

Dates must use:

```text
YYYY-MM-DD
```

## Example Response

```json
{
    "success": true,
    "data": {
        "status": "success",
        "username": "HamidSiddiqui12",
        "profile": {
            "username": "HamidSiddiqui12",
            "name": "Hamid",
            "bio": null,
            "avatar_url": "https://avatars.githubusercontent.com/...",
            "location": "India, Delhi",
            "company": null,
            "website": "",
            "followers": 22,
            "following": 22,
            "public_repositories": 26
        },
        "enabled_sections": [
            "Profile",
            "Repositories",
            "Languages",
            "Contributions"
        ],
        "total_sections": 4,
        "repository_count": 27,
        "top_repositories": [
            {
                "name": "foodBite",
                "stars": 1
            }
        ],
        "languages": {
            "C": 90.07,
            "C++": 3.74,
            "TypeScript": 2.02,
            "HTML": 1.58
        },
        "contributions": {
            "total": 88,
            "period": "1_year",
            "start_date": "2025-09-08",
            "end_date": "2026-09-08"
        }
    },
    "error": null
}
```

## Error Handling

The engine returns structured errors instead of exposing raw GitHub API responses.

Example:

```json
{
    "success": false,
    "data": null,
    "error": {
        "code": "USER_NOT_FOUND",
        "message": "GitHub user not found"
    }
}
```

Current error codes include:

| Code                          | Meaning                                   |
| ----------------------------- | ----------------------------------------- |
| `USER_NOT_FOUND`              | GitHub username does not exist            |
| `RATE_LIMIT_EXCEEDED`         | GitHub API rate limit was exceeded        |
| `GITHUB_API_ERROR`            | GitHub API or network failure             |
| `MALFORMED_RESPONSE`          | GitHub returned unexpected data           |
| `INVALID_CONTRIBUTION_PERIOD` | Invalid contribution period or date range |

## Testing

The project uses pytest.

Run all tests:

```bash
pytest -v
```

The current test suite covers:

* Successful profile requests
* Missing GitHub users
* Invalid contribution periods
* All supported contribution periods
* Custom contribution periods
* Invalid custom date ranges
* Repository responses
* Language responses

## Architecture

The basic flow is:

```text
Client / Web App
       |
       v
   FastAPI API
       |
       v
  Portfolio Engine
       |
       +------> GitHub REST API
       |
       +------> GitHub GraphQL API
       |
       v
 Structured Portfolio Response
```

The client does not need to independently parse GitHub API responses. The engine handles GitHub communication, data processing, validation, and response formatting.

## Notes

* GitHub username is the primary identifier.
* Profile information is always included.
* Repositories, languages, and contributions are optional sections.
* Contribution totals represent the selected date range.
* The engine currently calculates language percentages from the repositories it fetches.
* The GitHub token should always be stored in `.env` and never committed to the repository.
