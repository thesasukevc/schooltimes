CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, salt TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'reader' CHECK(role IN ('reader','admin')), created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
--> statement-breakpoint
CREATE TABLE admin_claims (id INTEGER PRIMARY KEY CHECK(id=1), user_id TEXT NOT NULL REFERENCES users(id));
--> statement-breakpoint
CREATE TABLE articles (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT NOT NULL, category TEXT NOT NULL, type TEXT NOT NULL, author_id TEXT NOT NULL REFERENCES users(id), published_at TEXT NOT NULL, views INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE article_likes (article_id TEXT NOT NULL REFERENCES articles(id), user_id TEXT NOT NULL REFERENCES users(id), PRIMARY KEY(article_id,user_id));
--> statement-breakpoint
CREATE TABLE breaking_news (id TEXT PRIMARY KEY, text TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 0, url TEXT, expires_at TEXT);
--> statement-breakpoint
CREATE TABLE archive (id TEXT PRIMARY KEY, title TEXT NOT NULL, pdf_url TEXT NOT NULL, issue_number INTEGER, published_at TEXT);
--> statement-breakpoint
CREATE TABLE polls (id TEXT PRIMARY KEY, question TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE poll_options (id TEXT PRIMARY KEY, poll_id TEXT NOT NULL REFERENCES polls(id), text TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE poll_votes (poll_id TEXT NOT NULL REFERENCES polls(id), user_id TEXT NOT NULL REFERENCES users(id), option_id TEXT NOT NULL REFERENCES poll_options(id), PRIMARY KEY(poll_id,user_id));
--> statement-breakpoint
CREATE TABLE rate_limits (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL);
