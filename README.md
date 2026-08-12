# Mohsion

Mohsion is a real-time, Notion-inspired productivity and task management application. It enables teams and individuals to organize workflows, track progress, and collaborate in real-time with a smooth, responsive interface.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## ✨ Features

- 🏗️ **Collaborative Workspaces:** Create and manage tasks in separate, dedicated workspaces.
- ⚡ **Real-time Synchronization:** Instant updates using Socket.IO for seamless collaboration.
- 🎨 **Smooth UI:** Optimized for a snappy, Notion-like user experience.
- 🚀 **Performance:** Integrated caching and rate limiting for reliability.
- 📝 *Upcoming:* Commenting system, offline editing, and audit logging.

---

## 🏗️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, React, Redux, Tailwind CSS |
| **Backend** | Node.js, Express, TypeScript |
| **Real-time** | Socket.IO |
| **Database** | PostgreSQL |
| **Cache/PubSub** | Redis |
| **DevOps** | Docker, Docker Compose |

---

## 📂 Project Architecture

```text
.
├── back-end/
│   ├── src/
│   │   ├── cache/
│   │   ├── config/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   ├── queries/
│   │   │   └── repositories/
│   │   ├── middleware/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── list/
│   │   │   ├── operation/
│   │   │   ├── todo/
│   │   │   └── workspace/
│   │   ├── socket/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env
│   ├── docker-compose.yml
│   ├── package.json
│   ├── scripts-wait-for-services.mjs
│   └── tsconfig.json
│
├── front-end/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── signin/
│   │   │   │   └── signup/
│   │   │   ├── invite/
│   │   │   │   └── [token]/
│   │   │   ├── workspace/
│   │   │   │   └── [workspaceId]/
│   │   │   ├── favicon.ico
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── board/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── lists/
│   │   │   ├── tasks/
│   │   │   ├── toasts/
│   │   │   └── workspaces/
│   │   ├── hooks/
│   │   ├── services/
│   │   │   ├── api/
│   │   │   └── websocket/
│   │   ├── store/
│   │   ├── types/
│   │   └── utils/
│   ├── .env
│   ├── eslint.config.mjs
│   ├── next.config.ts
│   ├── next-env.d.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### 1. Clone the repository
```bash
git clone https://github.com/MohsenDowlati/mohsion.git
cd mohsion
```

### 2. Setup Backend
```bash
cd back-end
npm install
# Create a .env file (see Environment Variables section)
# Start DB and Redis containers:
docker compose up -d
# Run the server:
npm run dev
```

### 3. Setup Frontend
```bash
cd ../front-end
npm install
# Create a .env file (see Environment Variables section)
# Run the development server:
npm run dev
```

The application should now be accessible at `http://localhost:5000`.

---

## ⚙️ Environment Variables

Create a `.env` file in both `back-end/` and `front-end/` directories.

**Back-end (`back-end/.env`):**
```ini
PORT=3000
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_DB=mohsion
POSTGRES_USER=postgres
POSTGRES_PASSWORD=some-random-strong-password
POSTGRES_PORT=5433

REDIS_HOST=localhost
REDIS_PORT=6379


DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mohsion
REDIS_URL=redis://localhost:6379

JWT_SECRET=some-random-secret-idk
JWT_EXPIRES_IN=7d
```

**Front-end (`front-end/.env`):**
```ini
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
```

---

## 📡 API Documentation

This project uses Swagger for interactive API documentation. Once the backend is running, visit:
👉 `http://localhost:3000/docs`

**Example: Create a new task**
`POST /api/todo/:listId`

*Headers:* `Authorization: Bearer <token>`

*Request Body:*
```json
{
  "title": "Implement authentication",
  "description": "Add JWT authentication to the API",
  "position": 1,
  "priority": "high"
}
```

---

## 🗺️ Roadmap

- [ ] Add email invitations
- [ ] Add task comments and attachments
- [ ] Add audit logs
- [ ] Add end-to-end (E2E) tests
- [ ] Add CI/CD pipeline
- [ ] Add monitoring and structured logging

---

## 🤝 Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 👤 Author

**Mohsen Dowlati**
- GitHub: [@MohsenDowlati](https://github.com/MohsenDowlati)
- Email: [dowmohsen@gmail.com](mailto:dowmohsen@gmail.com)
- LinkedIn: [Mohsen Dowlati](https://www.linkedin.com/in/mohsen-dowlati-91a235220/)

---

## 📄 License

Distributed under the MIT License. See [LICENSE](https://choosealicense.com/licenses/mit/) for more information.
