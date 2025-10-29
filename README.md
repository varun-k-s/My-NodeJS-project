# Node.js Authentication with JWT and MongoDB

A simple authentication system built with **Node.js**, **Express**, **MongoDB**, and **JWT**.  
It includes secure signup and login functionality, protected routes, and EJS-rendered frontend pages.

---

## Features

- User signup and login using email & password
- Passwords hashed securely with **bcrypt**
- Authentication handled via **JSON Web Tokens (JWT)**
- Protected routes using custom `requireAuth` middleware
- Tokens stored in **HTTP-only cookies**
- Frontend rendered with **EJS**
- MongoDB connection via **Mongoose**

---

## Tech Stack

**Backend:** Node.js, Express  
**Database:** MongoDB (Atlas)  
**View Engine:** EJS  
**Authentication:** JSON Web Token (JWT), bcrypt  
**Environment:** dotenv (optional)
