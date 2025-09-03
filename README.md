# Task

## About application
A dumb vulnerable Node.js application built with Express.js that exposes a `/screenshot` endpoint. Screenshots are realized through Puppeteer which handles browser API via a Headless Chromium instance.

## Setup
1. Fork this repository under your GitHub namespace
2. Install dependencies `npm install`
3. Run Docker container `docker compose up`
4. Take a screenshot `curl -s http://localhost:80/screenshot?url=https://tidio.com`
5. Screenshot should appear in `app/screenshot` directory

## Your task
Prepare a detailed security assessment report that documents spotted vulnerabilities, weaknesses and misconfigurations. Propose recommendations and remediations. If you are able, provide a full attack chain or at least part of it.


