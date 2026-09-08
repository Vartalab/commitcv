import pytest

from models import PortfolioRequest
from engine import generate_portfolio, GitHubAPIError


def test_profile_only():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=False,
        include_contributions=False
    )

    result = generate_portfolio(request)

    assert result.status == "success"
    assert result.username == "HamidSiddiqui12"
    assert result.profile.username == "HamidSiddiqui12"


def test_user_not_found():

    request = PortfolioRequest(
        username="this-user-definitely-does-not-exist-999999",
        include_repositories=False,
        include_languages=False,
        include_contributions=False
    )

    with pytest.raises(GitHubAPIError) as error:
        generate_portfolio(request)

    assert error.value.code == "USER_NOT_FOUND"
    
def test_invalid_contribution_period():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=False,
        include_contributions=True,
        contribution_period="invalid_period"
    )

    with pytest.raises(GitHubAPIError) as error:
        generate_portfolio(request)

    assert error.value.code == "INVALID_CONTRIBUTION_PERIOD"
    
@pytest.mark.parametrize(
    "period",
    [
        "30_days",
        "3_months",
        "6_months",
        "1_year",
        "this_year",
    ]
)
def test_contribution_periods(period):

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=False,
        include_contributions=True,
        contribution_period=period
    )

    result = generate_portfolio(request)

    assert result.contributions is not None
    assert result.contributions.period == period
    assert result.contributions.total >= 0
    assert result.contributions.start_date
    assert result.contributions.end_date
    

def test_custom_contribution_period():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=False,
        include_contributions=True,
        contribution_period="custom",
        contribution_start="2026-08-01",
        contribution_end="2026-08-31"
    )

    result = generate_portfolio(request)

    assert result.contributions is not None
    assert result.contributions.period == "custom"
    assert result.contributions.start_date == "2026-08-01"
    assert result.contributions.end_date == "2026-08-31"
    assert result.contributions.total >= 0
    
def test_invalid_custom_contribution_period():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=False,
        include_contributions=True,
        contribution_period="custom",
        contribution_start="2026-08-31",
        contribution_end="2026-08-01"
    )

    with pytest.raises(GitHubAPIError) as error:
        generate_portfolio(request)

    assert error.value.code == "INVALID_CONTRIBUTION_PERIOD"

def test_repositories():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=True,
        include_languages=False,
        include_contributions=False
    )

    result = generate_portfolio(request)

    assert result.status == "success"
    assert result.repository_count >= 0
    assert isinstance(result.top_repositories, list)

def test_languages():

    request = PortfolioRequest(
        username="HamidSiddiqui12",
        include_repositories=False,
        include_languages=True,
        include_contributions=False
    )

    result = generate_portfolio(request)

    assert result.status == "success"
    assert isinstance(result.languages, dict)

    total_percentage = sum(result.languages.values())

    assert total_percentage <= 100.01