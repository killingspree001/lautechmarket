# Multi Vendor Mini Ecommerce

Welcome! This repository contains a compact, extensible multi-vendor e-commerce reference application. It is intended as a starting point for learning, rapid prototyping, and building a production-ready marketplace with clear boundaries between buyers, sellers, and the platform.

Key goals:
- Minimal, well-documented codebase that demonstrates multi-vendor flows (seller onboarding, product management, checkout, payouts).
- Clear API surface and frontend UX examples.
- Easy to run locally and to extend into production (Docker-first).

---

## Table of contents
- About
- Features
- Contributing
- License

---

## About
This project models a small multi-vendor marketplace:
- Sellers register, list products, manage inventory and orders.
- Buyers browse, add to cart, checkout.
- Platform mediates payments and optionally handles payouts to sellers.
- Focus on separation of concerns and clear integration points (payments, notifications, admin).

This repo intentionally keeps features focused so you can plug in additional services (payment provider, analytics, search) without heavy refactors.

---

## Features
- User roles: buyer, seller, admin
- Seller onboarding & store management
- Product CRUD with categories and simple inventory
- Cart and checkout flows
- Authentication (Firebase)
- Validation, error handling, and simple rate limiting examples
- Tests for core business logic

---

## Contributing
Contributions are welcome. Please follow these steps:
1. Fork the repository.
2. Create a branch: git checkout -b feature/your-feature
3. Run tests and linters locally.
4. Open a PR with a clear description and tests for new behavior.
5. Include a short CONTRIBUTING.md in the repo with branch naming, commit message format, and PR checklist.

---

## License
MIT License — see LICENSE file for details.