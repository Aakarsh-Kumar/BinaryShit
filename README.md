# <div align="center"> Binary Dump </div>

## <div align="center"> The Ultimate Anonymous Dumping Platform 🚀 </div>

Binary Dump is an anonymous platform designed for our class to **rant, share memories, and post anything freely**. Built **overnight**, it quickly became a hotspot for raw, unfiltered thoughts. However, with great anonymity comes great chaos—we faced **NoSQL injection, object injection, DDoS, and XSS attacks** on launch night. But after pulling an all-nighter securing the server, Binary Dump stood strong and remains **fully functional and attack-resistant**. We’re now working on **new updates** to make it even more interactive—maybe even for a wider audience!

## 🚀 Features

- **Anonymous Posting**: Share thoughts and memories without revealing identity.
- **Secure & Resilient**: Patched against NoSQL Injection, DDoS, and XSS attacks.
- **Fast & Simple UI**: A seamless experience, thanks to **Aditya**.
- **Built for Fun**: A place to dump thoughts, make memories, and laugh.
- **Upcoming Updates**: More interactions for the class—and maybe beyond!

---

## 🛠️ Getting Started

### Prerequisites

- Node.js & npm
- MongoDB
- A deployment platform (Vercel recommended)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/Aakarsh-Kumar/binary-dump.git
   ```

   ```
   cd binary-dump
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables (`.env` file):
   for server:
   ```
   MONGO_URI=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   RECAPTCHA_SECRET = recaptcha_secret_key
   ALLOWED_ORIGINS = "http://localhost:5173"
   ```
   for client:
   ```
   VITE_BASE_API_URL ="http://127.0.0.1:8080"
   VITE_ALLOWED_ORIGINS="http://localhost:5173"
   VITE_RECAPTCHA_SITEKEY = recaptcha_site_key
   ```

5. Start the servers:
   for server-side
   ```
   npm start
   ```
   for client-side
   ```
   npm dev
   ```

7. Access the platform locally:

   ```
   http://localhost:5173
   ```

---

## 🛡 Security Enhancements

- **NoSQL Injection Protection**: Sanitized queries & input validation.
- **DDoS Mitigation**: Rate limiting & IP blocking.
- **XSS Prevention**: Content sanitization & secure headers.
- **Object Injection Protection**: Controlled data access & validation.

Big thanks to **Rahul Marban** for helping me understand **server security with Vercel**.

---

## 🗂 Project Structure

```
binary-dump/
├── server/
│   ├── controllers          # Server & API handling
│   ├── routes/              # API Endpoints
│   ├── models/              # Database Schemas
│   ├── logger.mjs/          # Logging format file
│   ├── index.mjs            # Main Server File
│   ├── .env                 # Client side env variables.
|   ├── package.json         # Dependencies & Scripts
├── client/                  
│   ├── src/
|   |   ├── assets/          # Logo and Icons
|   |   ├── pages/           # Main Page 
│   |   ├── App.jsx          # Entry Point
│   |   ├── App.css          # Importing Tailwind
│   |   ├── main.jsx         # Initial Origin Check
│   ├── index.html           # ReactDOM Rendering
|   ├── package.json         # Dependencies & Scripts
├── README.md                # Project Documentation
```

---

## 🎭 Upcoming Features

- **Reactions & Comments**: More ways to interact with posts.
- **Personalized Feeds**: Trending posts within the class.
- **Expanded Access**: Who knows? Maybe Binary Dump goes beyond our class!

---

## 🔗 Connect with Me

- 🧒 Portfolio: [aakarsh.is-a.dev](https://aaakarsh.is-a.dev)
- 💼 LinkedIn: [aakarsh-kumar25](https://www.linkedin.com/in/aakarsh-kumar25)
- 💻 GitHub: [Aakarsh-Kumar](https://github.com/Aakarsh-Kumar)
- 📱 Instagram: [@aakarsh_kumar25](https://www.instagram.com/aakarsh_kumar25/)

---
## Made with 💩 for unfiltered class memories
