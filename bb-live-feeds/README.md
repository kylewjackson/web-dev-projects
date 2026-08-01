# BB Live Feeds

A local Python application for creating complete, hierarchy-preserving archives of
Reddit discussion threads, initially focused on daily live-feed threads in
`r/BigBrother`.

The project is being built in deliberately small milestones. The current state is
**Milestone 1: project scaffolding**; download and CLI behavior are not implemented
yet.

## Architecture

The application uses a `src` package layout so local development and installed
behavior use the same import paths.

```text
bb-live-feeds/
├── archive/                         # Generated archives (ignored by Git)
├── src/reddit_archiver/
│   ├── reddit/                      # PRAW client and retrieval logic
│   ├── models/                      # Pydantic domain models
│   ├── storage/                     # JSON and future SQLite persistence
│   ├── cli.py                       # Thin command-line entry point
│   └── config.py                    # Environment and archive configuration
├── tests/                           # Unit and integration tests
├── .env.example
├── .gitignore
└── pyproject.toml
```

Responsibilities are separated so Reddit retrieval does not know how data is
stored, storage does not depend on CLI presentation, and future FastAPI routes can
reuse the same application services. Composition will be used to connect these
parts.

## Requirements

- Python 3.12 or newer
- [uv](https://docs.astral.sh/uv/)
- A Reddit script application (needed in a later milestone)

## Development setup

From this directory:

```bash
uv sync
cp .env.example .env
uv run reddit-archiver --help
```

The CLI currently reports that implementation is pending. Do not add real Reddit
credentials to `.env.example` or commit your local `.env` file.

## Planned milestones

1. Project scaffolding
2. Configuration management
3. Reddit API authentication
4. Thread downloader
5. Complete recursive comment retrieval
6. JSON serialization
7. Archive validation
8. Unit tests
9. Configurable archive organization

Scheduling, a FastAPI dashboard, summarization, and search/RAG are intentionally
deferred until the archival core is correct and tested.

## Git workflow

Keep commits focused on one milestone or concern. Generated archives, local
credentials, virtual environments, caches, and SQLite databases are ignored.
Before committing, review changes with `git diff --check` and run the test suite
once it is introduced.
