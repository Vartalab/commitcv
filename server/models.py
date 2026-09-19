from pydantic import BaseModel


class PortfolioRequest(BaseModel):
    username: str
    include_repositories: bool
    include_languages: bool
    include_contributions: bool

    contribution_period: str = "1_year"
    contribution_start: str | None = None
    contribution_end: str | None = None


class Profile(BaseModel):
    username: str
    name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    location: str | None = None
    company: str | None = None
    website: str | None = None
    followers: int
    following: int
    public_repositories: int


class Repository(BaseModel):
    name: str
    stars: int


class Contributions(BaseModel):
    total: int
    period: str
    start_date: str
    end_date: str


class PortfolioResponse(BaseModel):
    status: str
    username: str
    profile: Profile
    enabled_sections: list[str]
    total_sections: int
    repository_count: int
    top_repositories: list[Repository]
    languages: dict[str, float]
    contributions: Contributions | None = None


class ErrorResponse(BaseModel):
    code: str
    message: str


class EngineResponse(BaseModel):
    success: bool
    data: PortfolioResponse | None = None
    error: ErrorResponse | None = None