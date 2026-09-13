import requests
import argparse
from rich.console import Console
from rich.status import Status

console = Console()

API_URL = "http://127.0.0.1:8000/generate"


def show_logo():
    console.print("""
[cyan]
   ______                           _ __  _______    __
  / ____/___  ____ ___  ____ ___   (_) /_/ ____/ |  / /
 / /   / __ \\/ __ `__ \\/ __ `__ \\ / / __/ /    | | / /
/ /___/ /_/ / / / / / / / / / / // / /_/ /___  | |/ /
\\____/\\____/_/ /_/ /_/_/ /_/ /_//_/\\__/\\____/  |___/

        GitHub Portfolio Generator
[/cyan]
""")


def yes_no(question):
    while True:
        answer = input(question).strip().lower()

        if answer in ["y", "yes"]:
            return True

        if answer in ["n", "no"]:
            return False

        console.print("[red]Please enter y or n.[/red]")


def choose_period():

    console.print("\n[bold yellow]Contribution Period[/bold yellow]")
    print("1. Last 30 Days")
    print("2. Last 3 Months")
    print("3. Last 6 Months")
    print("4. Last 1 Year")
    print("5. This Year")
    print("6. Custom")

    mapping = {
        "1": "30_days",
        "2": "3_months",
        "3": "6_months",
        "4": "1_year",
        "5": "this_year",
        "6": "custom"
    }

    while True:
        choice = input("\nChoose (1-6): ").strip()

        if choice in mapping:
            period = mapping[choice]

            if period != "custom":
                return period, None, None

            start = input("Start Date (YYYY-MM-DD): ")
            end = input("End Date (YYYY-MM-DD): ")

            return period, start, end

        console.print("[red]Invalid choice.[/red]")


def save_markdown(data):

    filename = f"{data['username']}_PORTFOLIO.md"

    with open(filename, "w", encoding="utf-8") as file:

        file.write(f"# {data['profile']['name'] or data['username']}\n\n")
        file.write(f"**GitHub:** {data['username']}\n\n")

        file.write("## Profile\n\n")
        file.write(f"- Followers: {data['profile']['followers']}\n")
        file.write(f"- Following: {data['profile']['following']}\n")
        file.write(f"- Public Repositories: {data['profile']['public_repositories']}\n\n")

        if data["languages"]:
            file.write("## Languages\n\n")
            file.write("| Language | Usage |\n")
            file.write("|----------|------:|\n")

            for lang, pct in sorted(
                data["languages"].items(),
                key=lambda x: x[1],
                reverse=True
            ):
                file.write(f"| {lang} | {pct:.2f}% |\n")

            file.write("\n")

        if data["top_repositories"]:
            file.write("## Top Repositories\n\n")
            file.write("| Repository | Stars |\n")
            file.write("|------------|------:|\n")

            for repo in data["top_repositories"]:
                file.write(f"| {repo['name']} | ⭐ {repo['stars']} |\n")

            file.write("\n")

        if data["contributions"]:
            c = data["contributions"]

            file.write("## Contributions\n\n")
            file.write(f"**Total:** {c['total']}\n\n")
            file.write(f"**Period:** {c['period']}\n\n")
            file.write(f"{c['start_date']} → {c['end_date']}\n")

    console.print(f"\n[green]Markdown saved as {filename}[/green]")


def print_result(data):

    p = data["profile"]

    console.print("\n[bold green]PROFILE[/bold green]")

    print(f"Username : {p['username']}")
    print(f"Name     : {p['name']}")
    print(f"Location : {p['location']}")
    print(f"Followers: {p['followers']}")
    print(f"Following: {p['following']}")

    if data["top_repositories"]:

        console.print("\n[bold green]TOP REPOSITORIES[/bold green]")

        for i, repo in enumerate(data["top_repositories"], 1):
            print(f"{i}. {repo['name']} ⭐ {repo['stars']}")

    if data["languages"]:

        console.print("\n[bold green]LANGUAGES[/bold green]")

        for lang, pct in sorted(
            data["languages"].items(),
            key=lambda x: x[1],
            reverse=True
        ):
            print(f"{lang:<15} {pct:.2f}%")

    if data["contributions"]:

        c = data["contributions"]

        console.print("\n[bold green]CONTRIBUTIONS[/bold green]")

        print(f"Total : {c['total']}")
        print(f"Period: {c['period']}")
        print(f"From  : {c['start_date']}")
        print(f"To    : {c['end_date']}")


def generate_portfolio():

    show_logo()

    while True:
        username = input("GitHub Username: ").strip()

        if username:
            break

        console.print("[red]Username cannot be empty.[/red]")

    include_repositories = yes_no("Include repositories? (y/n): ")
    include_languages = yes_no("Include languages? (y/n): ")
    include_contributions = yes_no("Include contributions? (y/n): ")

    period = "1_year"
    start = None
    end = None

    if include_contributions:
        period, start, end = choose_period()

    payload = {
        "username": username,
        "include_repositories": include_repositories,
        "include_languages": include_languages,
        "include_contributions": include_contributions,
        "contribution_period": period,
        "contribution_start": start,
        "contribution_end": end
    }

    try:

        with console.status("[bold cyan]Fetching GitHub data...[/bold cyan]"):

            response = requests.post(
                API_URL,
                json=payload,
                timeout=30
            )

    except requests.exceptions.ConnectionError:

        console.print("\n[red]Backend is not running.[/red]")
        console.print("Start it using:")
        console.print("uvicorn app:app --reload")
        return

    result = response.json()

    if not result["success"]:

        console.print("\n[bold red]ERROR[/bold red]")
        console.print(result["error"]["code"])
        console.print(result["error"]["message"])
        return

    data = result["data"]

    print_result(data)

    if yes_no("\nSave as Markdown? (y/n): "):
        save_markdown(data)

    console.print("\n[bold green]Done![/bold green]")


VERSION = "0.1.0"
def main():

    parser = argparse.ArgumentParser(
        prog="commitcv",
        description="GitHub Portfolio Generator"
    )

    parser.add_argument(
        "--version",
        action="version",
        version=f"CommitCV {VERSION}"
    )

    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser(
        "generate",
        help="Generate GitHub portfolio"
    )

    args = parser.parse_args()

    if args.command == "generate":
        generate_portfolio()
    else:
        show_logo()
        parser.print_help()


if __name__ == "__main__":
    main()