# IYE Backend — Database ERD (Entity Relationship Diagram)

## Overview

This document describes the full database schema and entity relationships for the IYE Backend. All entities extend **BaseEntity** (PK `id`, `created_at`, `updated_at`).

---

## High-Level ER Diagram (Mermaid)

```mermaid
erDiagram
    users ||--o{ user_addresses : "has"
    users ||--o{ stores : "vendor_of"
    users ||--o{ orders : "places"
    users ||--o| wallets : "has"
    users ||--o{ reviews : "writes"

    markets ||--o{ stores : "contains"
    stores ||--o{ products : "sells"
    stores ||--o{ orders : "receives"
    stores ||--o{ order_transactions : "receives_payment"

    categories ||--o{ products : "categorizes"
    products ||--o{ order_items : "in"
    products ||--o{ reviews : "rated_by"

    orders ||--o{ order_items : "contains"
    orders ||--o{ order_transactions : "paid_by"
    orders }o--o| user_addresses : "delivered_to"

    wallets ||--o{ wallet_transactions : "has"

    users {
        int id PK
        varchar name
        varchar email UK
        varchar phone
        varchar password
        enum role
        boolean is_verified
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    markets {
        int id PK
        varchar name
        varchar location
        text description
        timestamp created_at
        timestamp updated_at
    }

    stores {
        int id PK
        int market_id FK
        int vendor_id FK
        varchar store_name
        varchar logo
        time open_time
        time closed_time
        boolean is_approved
        timestamp created_at
        timestamp updated_at
    }

    categories {
        int id PK
        varchar name
        text description
        varchar icon
        varchar image
        timestamp created_at
        timestamp updated_at
    }

    products {
        int id PK
        int category_id FK
        int store_id FK
        varchar name
        decimal price
        int quantity
        int rating_count
        decimal rating_total
        timestamp created_at
        timestamp updated_at
    }

    user_addresses {
        int id PK
        int user_id FK
        varchar phone
        text address
        varchar title
        timestamp created_at
        timestamp updated_at
    }

    orders {
        int id PK
        int store_id FK
        int user_id FK
        int address_id FK
        enum status
        boolean is_paid
        decimal total_bill
        decimal discount
        varchar payment_method
        timestamp created_at
        timestamp updated_at
    }

    order_items {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
        timestamp created_at
        timestamp updated_at
    }

    order_transactions {
        int id PK
        varchar transaction_id
        int order_id FK
        int user_id FK
        int store_id FK
        varchar payment_method
        decimal amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    reviews {
        int id PK
        int product_id FK
        int user_id FK
        smallint rating
        text comment
        timestamp created_at
        timestamp updated_at
    }

    wallets {
        int id PK
        int user_id FK UK
        decimal balance
        timestamp created_at
        timestamp updated_at
    }

    wallet_transactions {
        int id PK
        int wallet_id FK
        decimal amount
        enum type
        varchar reference_type
        int reference_id
        decimal balance_after
        timestamp created_at
        timestamp updated_at
    }

    kyc {
        int id PK
        varchar bvn
        varchar nin_front
        varchar nin_back
        varchar bvn_number
        timestamp created_at
        timestamp updated_at
    }
```

---

## Detailed Entity Specifications

### 1. **users**

| Column             | Type         | Constraints              | Description             |
| ------------------ | ------------ | ------------------------ | ----------------------- |
| id                 | int          | PK, auto-increment       | Primary key             |
| name               | varchar(255) | NOT NULL                 | Full name               |
| email              | varchar(255) | NOT NULL, UNIQUE         | Email (login)           |
| phone              | varchar(255) | NOT NULL                 | Phone number            |
| password           | varchar(255) | NOT NULL                 | Hashed password         |
| otp                | varchar(6)   | NULL                     | OTP code                |
| otp_expiry         | timestamp    | NULL                     | OTP expiry              |
| role               | enum         | NOT NULL, default 'user' | user, vendor, rap       |
| profile            | varchar      | NULL                     | Profile image URL       |
| is_verified        | boolean      | default false            | Email/phone verified    |
| is_active          | boolean      | default true             | Account active          |
| last_login         | timestamp    | NULL                     | Last login time         |
| is_social_login    | boolean      | default false            | Signed up via social    |
| type               | enum         | NULL                     | google, facebook, apple |
| social_provider_id | varchar(255) | NULL                     | Provider user id        |
| created_at         | timestamp    |                          | From BaseEntity         |
| updated_at         | timestamp    |                          | From BaseEntity         |

---

### 2. **markets**

| Column                 | Type         | Constraints | Description      |
| ---------------------- | ------------ | ----------- | ---------------- |
| id                     | int          | PK          | Primary key      |
| name                   | varchar(255) | NOT NULL    | Market name      |
| location               | varchar(500) | NULL        | Location/address |
| description            | text         | NULL        | Description      |
| created_at, updated_at | timestamp    |             | BaseEntity       |

**Relations:** One market has many **stores**.

---

### 3. **stores**

| Column                 | Type         | Constraints               | Description            |
| ---------------------- | ------------ | ------------------------- | ---------------------- |
| id                     | int          | PK                        | Primary key            |
| market_id              | int          | FK → markets.id, RESTRICT | Market (shop location) |
| vendor_id              | int          | FK → users.id, CASCADE    | Owner (vendor)         |
| store_name             | varchar(255) | NOT NULL                  | Store display name     |
| logo                   | varchar(500) | NULL                      | Logo URL               |
| cover_image            | varchar(500) | NULL                      | Cover image URL        |
| open_time              | time         | NULL                      | Opening time           |
| closed_time            | time         | NULL                      | Closing time           |
| is_approved            | boolean      | default false             | Admin approved         |
| created_at, updated_at | timestamp    |                           | BaseEntity             |

**Relations:** ManyToOne **market**, ManyToOne **user** (vendor). One store has many **products** and many **orders**.

---

### 4. **categories**

| Column                 | Type         | Constraints | Description   |
| ---------------------- | ------------ | ----------- | ------------- |
| id                     | int          | PK          | Primary key   |
| name                   | varchar(255) | NOT NULL    | Category name |
| description            | text         | NULL        | Description   |
| icon                   | varchar(500) | NULL        | Icon URL      |
| image                  | varchar(500) | NULL        | Image URL     |
| created_at, updated_at | timestamp    |             | BaseEntity    |

**Relations:** One category has many **products**.

---

### 5. **products**

| Column                 | Type          | Constraints                  | Description                        |
| ---------------------- | ------------- | ---------------------------- | ---------------------------------- |
| id                     | int           | PK                           | Primary key                        |
| category_id            | int           | FK → categories.id, RESTRICT | Category                           |
| store_id               | int           | FK → stores.id, CASCADE      | Selling store                      |
| name                   | varchar(255)  | NOT NULL                     | Product name                       |
| price                  | decimal(12,2) | NOT NULL                     | Unit price                         |
| quantity               | int           | default 0                    | Stock quantity                     |
| description            | text          | NULL                         | Description                        |
| purity                 | varchar(50)   | NULL                         | e.g. "100%"                        |
| unit                   | varchar(50)   | NULL                         | kg, piece, litre, etc.             |
| main_image             | varchar(500)  | NULL                         | Main image URL                     |
| additional_images      | simple-array  | NULL                         | Extra image URLs                   |
| rating_count           | int           | default 0                    | Number of raters                   |
| rating_total           | decimal(10,2) | default 0                    | Sum of ratings (avg = total/count) |
| created_at, updated_at | timestamp     |                              | BaseEntity                         |

**Relations:** ManyToOne **category**, ManyToOne **store**. One product has many **order_items** and many **reviews**.

---

### 6. **user_addresses**

| Column                 | Type         | Constraints            | Description       |
| ---------------------- | ------------ | ---------------------- | ----------------- |
| id                     | int          | PK                     | Primary key       |
| user_id                | int          | FK → users.id, CASCADE | Owner             |
| phone                  | varchar(50)  | NOT NULL               | Contact phone     |
| address                | text         | NOT NULL               | Full address      |
| title                  | varchar(100) | NOT NULL               | e.g. Home, Office |
| created_at, updated_at | timestamp    |                        | BaseEntity        |

**Relations:** ManyToOne **user**. Referenced by **orders** (delivery address).

---

### 7. **orders**

| Column                 | Type          | Constraints                      | Description                                                   |
| ---------------------- | ------------- | -------------------------------- | ------------------------------------------------------------- |
| id                     | int           | PK                               | Primary key                                                   |
| store_id               | int           | FK → stores.id, RESTRICT         | Shop                                                          |
| user_id                | int           | FK → users.id, RESTRICT          | Customer                                                      |
| address_id             | int           | FK → user_addresses.id, SET NULL | Delivery address                                              |
| status                 | enum          | default pending                  | pending, confirmed, processing, shipped, delivered, cancelled |
| is_paid                | boolean       | default false                    | Payment received                                              |
| total_bill             | decimal(12,2) | NOT NULL                         | Total amount                                                  |
| discount               | decimal(12,2) | default 0                        | Discount amount                                               |
| payment_method         | varchar(50)   | NULL                             | cash, card, online, wallet                                    |
| created_at, updated_at | timestamp     |                                  | BaseEntity                                                    |

**Relations:** ManyToOne **store**, **user**, **address**. OneToMany **order_items**. One order can have many **order_transactions**.

---

### 8. **order_items**

| Column                 | Type          | Constraints                | Description              |
| ---------------------- | ------------- | -------------------------- | ------------------------ |
| id                     | int           | PK                         | Primary key              |
| order_id               | int           | FK → orders.id, CASCADE    | Parent order             |
| product_id             | int           | FK → products.id, RESTRICT | Product                  |
| quantity               | int           | NOT NULL                   | Quantity ordered         |
| price                  | decimal(12,2) | NOT NULL                   | Unit price at order time |
| created_at, updated_at | timestamp     |                            | BaseEntity               |

**Relations:** ManyToOne **order**, **product**.

---

### 9. **order_transactions**

| Column                 | Type          | Constraints              | Description                                     |
| ---------------------- | ------------- | ------------------------ | ----------------------------------------------- |
| id                     | int           | PK                       | Primary key                                     |
| transaction_id         | varchar(255)  | NOT NULL                 | External/internal ref (e.g. gateway id)         |
| order_id               | int           | FK → orders.id, RESTRICT | Related order                                   |
| user_id                | int           | FK → users.id, RESTRICT  | Payer                                           |
| store_id               | int           | FK → stores.id, RESTRICT | Shop (receiver)                                 |
| payment_method         | varchar(50)   | NOT NULL                 | cash, card, online, wallet                      |
| amount                 | decimal(12,2) | NOT NULL                 | Amount transacted                               |
| status                 | enum          | default pending          | pending, completed, failed, refunded, cancelled |
| notes                  | text          | NULL                     | Gateway response / notes                        |
| created_at, updated_at | timestamp     |                          | BaseEntity                                      |

**Relations:** ManyToOne **order**, **user**, **store**.

---

### 10. **reviews**

| Column                 | Type      | Constraints               | Description      |
| ---------------------- | --------- | ------------------------- | ---------------- |
| id                     | int       | PK                        | Primary key      |
| product_id             | int       | FK → products.id, CASCADE | Product reviewed |
| user_id                | int       | FK → users.id, CASCADE    | Reviewer         |
| rating                 | smallint  | NOT NULL                  | 1–5              |
| comment                | text      | NULL                      | Optional comment |
| created_at, updated_at | timestamp |                           | BaseEntity       |

**Unique:** (product_id, user_id) — one review per user per product.

**Relations:** ManyToOne **product**, **user**.

---

### 11. **wallets**

| Column                 | Type          | Constraints                    | Description                 |
| ---------------------- | ------------- | ------------------------------ | --------------------------- |
| id                     | int           | PK                             | Primary key                 |
| user_id                | int           | FK → users.id, CASCADE, UNIQUE | Owner (one wallet per user) |
| balance                | decimal(12,2) | default 0                      | Current balance             |
| created_at, updated_at | timestamp     |                                | BaseEntity                  |

**Relations:** ManyToOne **user**. OneToMany **wallet_transactions**.

---

### 12. **wallet_transactions**

| Column                 | Type          | Constraints              | Description                        |
| ---------------------- | ------------- | ------------------------ | ---------------------------------- |
| id                     | int           | PK                       | Primary key                        |
| wallet_id              | int           | FK → wallets.id, CASCADE | Wallet                             |
| amount                 | decimal(12,2) | NOT NULL                 | + credit / - debit                 |
| type                   | enum          | NOT NULL                 | credit, debit                      |
| reference_type         | varchar(50)   | NULL                     | order, deposit, withdrawal, refund |
| reference_id           | int           | NULL                     | Related entity id                  |
| description            | text          | NULL                     | Note                               |
| balance_after          | decimal(12,2) | NULL                     | Balance after this tx              |
| created_at, updated_at | timestamp     |                          | BaseEntity                         |

**Relations:** ManyToOne **wallet**.

---

### 13. **kyc**

| Column                 | Type         | Constraints | Description           |
| ---------------------- | ------------ | ----------- | --------------------- |
| id                     | int          | PK          | Primary key           |
| bvn                    | varchar(500) | NULL        | BVN document path/URL |
| nin_front              | varchar(500) | NULL        | NIN front image       |
| nin_back               | varchar(500) | NULL        | NIN back image        |
| bvn_number             | varchar(20)  | NULL        | BVN number            |
| created_at, updated_at | timestamp    |             | BaseEntity            |

Standalone table (no FK in schema).

---

## Relationship Summary

| From           | To                  | Cardinality | FK / Notes               |
| -------------- | ------------------- | ----------- | ------------------------ |
| users          | user_addresses      | 1 : N       | user_id, CASCADE         |
| users          | stores              | 1 : N       | vendor_id, CASCADE       |
| users          | orders              | 1 : N       | user_id, RESTRICT        |
| users          | wallets             | 1 : 1       | user_id, CASCADE, UNIQUE |
| users          | reviews             | 1 : N       | user_id, CASCADE         |
| markets        | stores              | 1 : N       | market_id, RESTRICT      |
| stores         | products            | 1 : N       | store_id, CASCADE        |
| stores         | orders              | 1 : N       | store_id, RESTRICT       |
| stores         | order_transactions  | 1 : N       | store_id, RESTRICT       |
| categories     | products            | 1 : N       | category_id, RESTRICT    |
| products       | order_items         | 1 : N       | product_id, RESTRICT     |
| products       | reviews             | 1 : N       | product_id, CASCADE      |
| user_addresses | orders              | 1 : N       | address_id, SET NULL     |
| orders         | order_items         | 1 : N       | order_id, CASCADE        |
| orders         | order_transactions  | 1 : N       | order_id, RESTRICT       |
| wallets        | wallet_transactions | 1 : N       | wallet_id, CASCADE       |

---

## Simplified Diagrams for Slides (by domain)

**A. Users and identity:** users → user_addresses, users → wallets → wallet_transactions.

**B. Commerce:** markets → stores (vendor = users), categories → products ← stores, orders (user, store, address) → order_items ← products.

**C. Payments and reviews:** orders → order_transactions (user, store), products → reviews ← users.

Use these flows on separate slides; the full Mermaid ERD is in the first diagram and in `ERD_PRESENTATION.mmd`.

---

## How to Use This for Presentation

1. **Mermaid diagram:** Copy the Mermaid block from this file into any tool that supports Mermaid (e.g. GitHub, GitLab, Notion, Mermaid Live Editor, or VS Code with a Mermaid extension) to render the ER diagram.
2. **Export as image:** Use [Mermaid Live Editor](https://mermaid.live): open `docs/ERD_PRESENTATION.mmd` or paste a diagram, then export as PNG/SVG for slides.
3. **Detailed tables:** Use the “Detailed Entity Specifications” and “Relationship Summary” sections for speaker notes or appendix slides.
4. **Standalone file:** `docs/ERD_PRESENTATION.mmd` has the full ERD for Mermaid Live export.
