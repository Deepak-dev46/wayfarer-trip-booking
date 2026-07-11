-- Reference only — Hibernate's ddl-auto=update (see application.properties)
-- creates/updates these tables automatically on startup. This file is here
-- in case you want to hand these off to a DBA or run them manually instead.

CREATE DATABASE IF NOT EXISTS wayfarer_auth;
USE wayfarer_auth;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL,
    last_login_at DATETIME NULL
);

CREATE TABLE IF NOT EXISTS blacklisted_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    blacklisted_at DATETIME NOT NULL
);
