# Express Advanced

A structured collection of Express.js learning modules covering core backend concepts — from serving static files and templating with EJS, to database integration with MongoDB and authentication using Bcrypt and JSON Web Tokens.

This repository is organized as a hands-on reference for building production-aware Node.js applications, with each module isolated in its own directory with its own dependencies and configuration.

---

## Repository Structure

```
Express_Advanced/
|
|-- index.js                  # Root Express server — file system operations, EJS rendering
|-- package.json              # Root project configuration
|-- views/                    # EJS templates
|-- public/                   # Static assets (CSS, JS)
|-- files/                    # File storage for fs module experiments
|
|-- DB/                       # MongoDB + Mongoose module
|   |-- app.js                # Express server with full CRUD routes
|   |-- appmodel.js           # Mongoose schema and model definition
|   |-- package.json
|   `-- THEORY.md             # Conceptual notes on databases and Mongoose
|
|-- Auth/                     # Authentication pattern experiments
|   |-- auth.js               # Cookie handling and Bcrypt hashing/comparison
|   |-- jsonwebtokens.js      # JWT token generation and verification
|   |-- flow_auth.md          # Notes on authentication vs authorization
|   `-- package.json
|
|-- auth-login/               # Full user registration and login system
|   |-- app.js                # Express server with all auth routes
|   |-- models/
|   |   `-- usermodel.js      # Mongoose schema for users
|   |-- views/
|   |   |-- index.ejs         # Registration form
|   |   |-- home.ejs          # User dashboard showing all registered users
|   |   |-- forget.ejs        # Forgot password page
|   |   `-- support.ejs       # Support coming soon page
|   |-- public/               # Static assets
|   |-- flow.txt              # Implementation flow notes
|   `-- package.json
|
`-- Express_server/           # Express fundamentals experiments
```

---

## Modules

### Root — Express Fundamentals

The root `index.js` demonstrates foundational Express patterns:

- **EJS Templating** — rendering dynamic HTML views using `res.render()`
- **Static File Serving** — serving CSS and JavaScript through `express.static()`
- **File System Operations** — reading and writing files using Node's built-in `fs` module
- **Middleware** — using `express.json()` and `express.urlencoded()` for request body parsing

**Stack:**  Express 5, EJS, TailwindCSS 4, Nodemon

---

### DB — MongoDB and Mongoose CRUD

Located in `DB/`, this module connects to a local MongoDB instance and exposes REST-like GET routes to perform all standard database operations on a `user` collection.

**Mongoose Schema**

```javascript
const userSchema = {
    name:        String,
    age:         Number,
    designation: String,
    email:       String,
    password:    String
}
```

**API Routes**

| Route         | Operation                         | Mongoose Method              |
|---------------|-----------------------------------|------------------------------|
| `/home`       | Health check                      | —                            |
| `/create`     | Insert a new user document        | `Model.create()`             |
| `/readall`    | Fetch all user documents          | `Model.find()`               |
| `/read`       | Fetch a single user by name       | `Model.find({ name })`       |
| `/update`     | Update a user's password by name  | `Model.findOneAndUpdate()`   |
| `/delete`     | Remove a user document by name    | `Model.findOneAndDelete()`   |

**Database Hierarchy**

```
MongoDB Server  -->  Database  -->  Collection  -->  Document
```

**Stack:** Express 5, Mongoose 9, MongoDB 7 (local)

**Prerequisites:** MongoDB must be running locally before starting this server.

```bash
brew services start mongodb-community@7.0
```

**Start**

```bash
cd DB
npm start       # runs on port 3000
```

---

### Auth — Authentication Patterns

Located in `Auth/`, this module demonstrates three core authentication mechanisms used in production Node.js applications.

#### Authentication vs Authorization

| Concept        | Definition                                                           |
|----------------|----------------------------------------------------------------------|
| Authentication | Verifying the identity of a user based on credentials               |
| Authorization  | Verifying whether an authenticated user has access to a resource    |

---

#### Cookies — `auth.js`

Demonstrates how Express sets and reads HTTP cookies using `cookie-parser`.

```
GET /login        Sets a cookie named "name" with value "kartik"
```

**Key concept:** Cookies persist session identity across HTTP requests by attaching small pieces of data to the response header, which the browser sends back on every subsequent request.

---

#### Bcrypt — `auth.js`

Demonstrates password hashing and comparison using the `bcrypt` library.

```
GET /bcrypt           Generates a salt and hashes a plaintext password
GET /bcrypt/:check    Compares a stored hash against a plaintext string
```

**Key concept:** Bcrypt is a one-way hashing function with a configurable cost factor (salt rounds). The plaintext password is never stored; only the hash is persisted in the database.

```
bcrypt.genSalt(rounds)              -->  generates a salt
bcrypt.hash(plaintext, salt)        -->  produces a hash
bcrypt.compare(plaintext, hash)     -->  returns true or false
```

---

#### JSON Web Tokens — `jsonwebtokens.js`

Demonstrates stateless authentication using the `jsonwebtoken` library.

```
GET /jwt-login    Signs a JWT payload and returns the token
```

**Key concept:** A JWT consists of three dot-separated, Base64-encoded parts:

```
Header . Payload . Signature
```

The payload contains the user's identity (e.g., email). The signature is created using a secret key known only to the server. On subsequent requests, the server verifies the token's signature to confirm authenticity without querying the database.

```javascript
jwt.sign({ email: "user@example.com" }, "SECRET_KEY")
// Returns a signed token string
```

**Security note:** The secret key must be stored in an environment variable (`.env`) and never hardcoded in source files for production use.

**Stack:** Express 5, Bcrypt 6, cookie-parser 1, jsonwebtoken 9

**Start**

```bash
cd Auth
npm start       # runs on port 8000
```

---

### auth-login — Full Registration and Login System

Located in `auth-login/`, this is a complete end-to-end user authentication implementation combining all previous concepts: MongoDB persistence, Bcrypt password hashing, JWT token generation, and cookie-based session management.

**API Routes**

| Route          | Method | Description                                              |
|----------------|--------|----------------------------------------------------------|
| `/create`      | GET    | Renders the registration form (`index.ejs`)              |
| `/create`      | POST   | Creates a user, hashes password, sets JWT cookie, redirects to `/user` |
| `/user`        | GET    | Fetches all users from MongoDB and renders the dashboard |
| `/forget`      | GET    | Renders the forgot password page                         |
| `/support`     | GET    | Renders the support page                                 |
| `/logout`      | POST   | Clears the JWT cookie and redirects to `/create`         |

**Registration Flow**

```
User submits form
  --> POST /create
  --> Extract { username, email, password, age } from req.body
  --> bcrypt.genSalt(10)  -->  bcrypt.hash(password, salt)
  --> userModel.create({ username, email, password: hash, age })
  --> jwt.sign({ email }, SECRET)  -->  res.cookie("token", token)
  --> res.redirect("/user")
  --> GET /user  -->  userModel.find()  -->  res.render("home", { users })
```

**User Schema**

```javascript
{
    username: String,
    email:    String,
    password: String,   // bcrypt hash, never plaintext
    age:      Number
}
```

**Stack:** Express 5, Mongoose 9, Bcrypt 5, jsonwebtoken 9, cookie-parser, EJS 6, MongoDB 7

**Start**

```bash
cd auth-login
npm start       # runs on port 3000
```

---

### Prerequisites

- Node.js v18 or higher
- MongoDB Community Edition (for the DB module)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/Pantkartik/Express_Advanced.git
cd Express_Advanced
```

Install dependencies for each module:

```bash
# Root
npm install

# DB module
cd DB && npm install

# Auth module
cd ../Auth && npm install

# auth-login module
cd ../auth-login && npm install
```

### Running Modules

Each module runs independently on its own port.

```bash
# Root server (port 8000)
npm start

# DB server (port 3000) — requires MongoDB running
cd DB && npm start

# Auth server (port 8000)
cd Auth && npm start

# auth-login server (port 3000) — requires MongoDB running
cd auth-login && npm start
```

---

## Key Concepts Covered

- Express routing and middleware architecture
- Template rendering with EJS
- Static file serving and asset management
- File system operations with Node's `fs` module
- MongoDB connection and schema definition with Mongoose
- Full CRUD operations using Mongoose query methods
- Cookie-based session management
- Password hashing and verification with Bcrypt
- Stateless authentication with JSON Web Tokens
- End-to-end user registration with hashed passwords and JWT sessions

---

## License

ISC