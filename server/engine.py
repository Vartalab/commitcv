import os
from datetime import date, timedelta

import requests

from dotenv import load_dotenv

from models import (
    PortfolioRequest,
    PortfolioResponse,
    Profile,
    Contributions,
)


load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}


class GitHubAPIError(Exception):
    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


def generate_portfolio(data: PortfolioRequest) -> PortfolioResponse:

    profile_data = fetch_github_profile(data.username)

    profile = Profile(
        username=profile_data.get("login"),
        name=profile_data.get("name"),
        bio=profile_data.get("bio"),
        avatar_url=profile_data.get("avatar_url"),
        location=profile_data.get("location"),
        company=profile_data.get("company"),
        website=profile_data.get("blog"),
        followers=profile_data.get("followers", 0),
        following=profile_data.get("following", 0),
        public_repositories=profile_data.get("public_repos", 0)
    )

    repos = []

    if data.include_repositories or data.include_languages:
        repos = fetch_repositories(data.username)

        repos.sort(
            key=lambda repo: repo.get("stargazers_count", 0),
            reverse=True
        )

    language_totals = {}
    languages = {}

    if data.include_languages:

        for repo in repos:

            languages_url = repo.get("languages_url")

            if not languages_url:
                continue

            try:
                response = requests.get(
                    languages_url,
                    headers=HEADERS,
                    timeout=10
                )
            except requests.RequestException:
                raise GitHubAPIError(
                    "GITHUB_API_ERROR",
                    "Unable to connect to GitHub"
                )

            if response.status_code == 403:
                raise GitHubAPIError(
                    "RATE_LIMIT_EXCEEDED",
                    "GitHub API rate limit exceeded"
                )

            if response.status_code != 200:
                raise GitHubAPIError(
                    "GITHUB_API_ERROR",
                    "Failed to fetch repository language data"
                )

            repo_languages = response.json()

            if not isinstance(repo_languages, dict):
                raise GitHubAPIError(
                    "MALFORMED_RESPONSE",
                    "GitHub returned invalid language data"
                )

            for language, bytes_count in repo_languages.items():
                language_totals[language] = (
                    language_totals.get(language, 0) + bytes_count
                )

        total_bytes = sum(language_totals.values())

        if total_bytes > 0:
            for language, bytes_count in language_totals.items():
                languages[language] = round(
                    (bytes_count / total_bytes) * 100,
                    2
                )

    top_repositories = []

    if data.include_repositories:

        for repo in repos[:5]:
            top_repositories.append({
                "name": repo.get("name", "Unknown"),
                "stars": repo.get("stargazers_count", 0)
            })

    contributions = None

    if data.include_contributions:
        contribution_total = fetch_contributions(data.username)

        contributions = Contributions(
            total=contribution_total
        )

    enabled_sections = ["Profile"]

    if data.include_repositories:
        enabled_sections.append("Repositories")

    if data.include_languages:
        enabled_sections.append("Languages")

    if data.include_contributions:
        enabled_sections.append("Contributions")

    return PortfolioResponse(
        status="success",
        username=profile.username,
        profile=profile,
        enabled_sections=enabled_sections,
        total_sections=len(enabled_sections),
        repository_count=len(repos),
        top_repositories=top_repositories,
        languages=languages,
        contributions=contributions
    )


def fetch_github_profile(username: str):

    url = f"https://api.github.com/users/{username}"

    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=10
        )
    except requests.RequestException:
        raise GitHubAPIError(
            "GITHUB_API_ERROR",
            "Unable to connect to GitHub"
        )

    if response.status_code == 404:
        raise GitHubAPIError(
            "USER_NOT_FOUND",
            "GitHub user not found"
        )

    if response.status_code == 403:
        raise GitHubAPIError(
            "RATE_LIMIT_EXCEEDED",
            "GitHub API rate limit exceeded"
        )

    if response.status_code != 200:
        raise GitHubAPIError(
            "GITHUB_API_ERROR",
            "GitHub API request failed"
        )

    profile = response.json()

    if not isinstance(profile, dict) or "login" not in profile:
        raise GitHubAPIError(
            "MALFORMED_RESPONSE",
            "GitHub returned an invalid profile response"
        )

    return profile


def fetch_repositories(username: str):

    repos = []
    page = 1

    while True:

        url = f"https://api.github.com/users/{username}/repos"

        params = {
            "per_page": 100,
            "page": page,
            "type": "all"
        }

        try:
            response = requests.get(
                url,
                headers=HEADERS,
                params=params,
                timeout=10
            )
        except requests.RequestException:
            raise GitHubAPIError(
                "GITHUB_API_ERROR",
                "Unable to connect to GitHub"
            )

        if response.status_code == 403:
            raise GitHubAPIError(
                "RATE_LIMIT_EXCEEDED",
                "GitHub API rate limit exceeded"
            )

        if response.status_code != 200:
            raise GitHubAPIError(
                "GITHUB_API_ERROR",
                "Failed to fetch GitHub repositories"
            )

        page_repos = response.json()

        if not isinstance(page_repos, list):
            raise GitHubAPIError(
                "MALFORMED_RESPONSE",
                "GitHub returned an invalid repository response"
            )

        repos.extend(page_repos)

        if len(page_repos) < 100:
            break

        page += 1

    return repos


def fetch_contributions(username: str) -> int:

    today = date.today()
    one_year_ago = today - timedelta(days=365)

    query = """
    query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(
                from: $from
                to: $to
            ) {
                contributionCalendar {
                    totalContributions
                }
            }
        }
    }
    """

    variables = {
        "username": username,
        "from": f"{one_year_ago.isoformat()}T00:00:00Z",
        "to": f"{today.isoformat()}T23:59:59Z"
    }

    url = "https://api.github.com/graphql"

    try:
        response = requests.post(
            url,
            headers=HEADERS,
            json={
                "query": query,
                "variables": variables
            },
            timeout=10
        )
    except requests.RequestException:
        raise GitHubAPIError(
            "GITHUB_API_ERROR",
            "Unable to connect to GitHub"
        )

    if response.status_code == 403:
        raise GitHubAPIError(
            "RATE_LIMIT_EXCEEDED",
            "GitHub API rate limit exceeded"
        )

    if response.status_code != 200:
        raise GitHubAPIError(
            "GITHUB_API_ERROR",
            "GitHub GraphQL API request failed"
        )

    result = response.json()

    if "errors" in result:
        raise GitHubAPIError(
            "GITHUB_API_ERROR",
            "GitHub returned an error while fetching contributions"
        )

    try:
        return result["data"]["user"]["contributionsCollection"][
            "contributionCalendar"
        ]["totalContributions"]

    except (KeyError, TypeError):
        raise GitHubAPIError(
            "MALFORMED_RESPONSE",
            "GitHub returned invalid contribution data"
        )