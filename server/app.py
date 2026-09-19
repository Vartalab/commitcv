from fastapi import FastAPI

from models import PortfolioRequest, EngineResponse
from engine import generate_portfolio, GitHubAPIError


app = FastAPI()


@app.post("/generate", response_model=EngineResponse)
def generate(data: PortfolioRequest):

    try:
        result = generate_portfolio(data)

        return EngineResponse(
            success=True,
            data=result
        )

    except GitHubAPIError as error:

        return EngineResponse(
            success=False,
            error={
                "code": error.code,
                "message": error.message
            }
        )