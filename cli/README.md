# CommitCV CLI

**CommitCV** is a command-line tool that generates a GitHub portfolio from a GitHub username.

It collects the user's preferences, sends the request to the CommitCV server, receives processed GitHub data, displays the result in the terminal, and can generate a Markdown portfolio file.

## ✨ What is CommitCV?

Creating a GitHub portfolio manually can take time. You need to collect information about your profile, repositories, programming languages, and contribution activity.

CommitCV automates this process.

With a single command, you can provide your GitHub username, choose the information you want to include, and generate a portfolio from your GitHub activity.

### CommitCV can include

* 👤 GitHub profile information
* 📦 Public repositories
* 💻 Programming languages
* 📈 Contribution activity
* ⭐ Repository information
* 📝 Markdown portfolio

---

## 🚀 How It Works

The basic flow is:

```text
User
  │
  ▼
CommitCV CLI
  │
  │ GitHub username + preferences
  ▼
CommitCV Server
  │
  │ Process GitHub data
  ▼
CommitCV CLI
  │
  ├── Display result in terminal
  │
  └── Generate Markdown portfolio
```

The CLI is responsible for interacting with the user, while the server processes the GitHub information.

---

## 📦 Installation

### For Users

Once CommitCV is published as a Python package, users will be able to install it using:

```bash
pip install commitcv
```

After installation, users can run:

```bash
commitcv
```

or:

```bash
commitcv generate
```

> **Note:** The published version is intended to handle the required backend communication automatically. Users should not need to manually start the backend server.

---

## 🖥️ Usage

### Start CommitCV

Run:

```bash
commitcv
```

This displays the available commands.

Example:

```text
GitHub Portfolio Generator

usage: commitcv [-h] [--version] {generate} ...

positional arguments:
  {generate}
    generate    Generate GitHub portfolio
```

---

### Generate a Portfolio

Run:

```bash
commitcv generate
```

CommitCV will ask for your GitHub username:

```text
GitHub Username:
```

Enter your GitHub username.

For example:

```text
GitHub Username: HamidSiddiqui12
```

---

## ⚙️ Choose Portfolio Sections

CommitCV lets you choose which information you want to include in your portfolio.

For example:

```text
Include repositories? (y/n):
Include languages? (y/n):
Include contributions? (y/n):
```

This allows users to customize the generated portfolio instead of including everything.

---

## 📈 Contribution Period

If contributions are selected, CommitCV will ask which period you want to use.

Available options include:

```text
1. Last 30 Days
2. Last 3 Months
3. Last 6 Months
4. Last 1 Year
5. This Year
6. Custom
```

For example:

```text
Select contribution period:

1. Last 30 Days
2. Last 3 Months
3. Last 6 Months
4. Last 1 Year
5. This Year
6. Custom

Enter your choice:
```

---

## 📝 Markdown Portfolio

After generating the portfolio, CommitCV asks whether you want to save the result as a Markdown file.

```text
Save as Markdown? (y/n):
```

If you choose:

```text
y
```

CommitCV creates a Markdown file using your GitHub username.

Example:

```text
HamidSiddiqui12_PORTFOLIO.md
```

The generated file can then be added to a GitHub repository, shared with others, or used as the starting point for a personal portfolio.

---

## 📄 Generated Portfolio

The generated Markdown portfolio can contain information such as:

### GitHub Profile

* Name
* Username
* Bio
* Profile information
* Followers
* Following
* Public repositories

### Repositories

* Repository names
* Repository descriptions
* Repository information
* Top repositories

### Languages

* Programming languages used across repositories

### Contributions

* Contribution activity
* Selected contribution period

The exact sections depend on the user's selections.

---

## 🎯 Example

A typical workflow looks like this:

```text
$ commitcv generate

GitHub Username: HamidSiddiqui12

Include repositories? (y/n): y
Include languages? (y/n): y
Include contributions? (y/n): y

Select contribution period:

1. Last 30 Days
2. Last 3 Months
3. Last 6 Months
4. Last 1 Year
5. This Year
6. Custom

Enter your choice: 4

Fetching GitHub information...
Processing portfolio...

Portfolio generated successfully!

Save as Markdown? (y/n): y

Markdown portfolio saved as:
HamidSiddiqui12_PORTFOLIO.md
```

---

## 🧩 Project Components

CommitCV consists of two main parts:

### CLI

The CLI is responsible for:

* Accepting user input
* Asking for portfolio preferences
* Sending requests to the server
* Displaying results
* Saving the generated Markdown portfolio

### Server

The server is responsible for:

* Receiving the GitHub username
* Processing GitHub information
* Collecting the required GitHub data
* Returning processed data to the CLI

Keeping these responsibilities separate allows the same server functionality to be used by other CommitCV clients in the future.

---

## 🔒 User Privacy

CommitCV only requests the information required to generate the selected portfolio sections.

Users choose which sections they want to include before generating the portfolio.

The generated Markdown file is created locally for the user.

---

## 🛠️ Development

If you want to work on CommitCV locally, clone the repository and set up the project according to the development instructions provided by the project maintainers.

The CLI and server are developed as separate components so that each part can be maintained independently.

---

## 🗺️ Project Goals

The goal of CommitCV is to make GitHub portfolio generation:

* **Simple** — generate a portfolio with a few prompts
* **Customizable** — choose which sections to include
* **Automated** — collect GitHub information automatically
* **Reusable** — use the processed GitHub data across different clients
* **Developer-friendly** — provide a simple command-line experience

---

## 📌 Current Status

CommitCV is currently under development.

The project is being built with a CLI and a shared server that processes GitHub profile information.

Features and commands may change as development continues.

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

If you would like to contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test your changes.
5. Create a pull request.

Please keep changes focused and explain what your pull request improves.

---

## 📜 License

License information will be added when the project license is finalized.

---

**CommitCV — Turn your GitHub activity into a portfolio.**
