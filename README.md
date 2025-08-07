# QuickTalk Chating Application 

![TypeScript](https://img.shields.io/badge/language-TypeScript-blue)
![WebSocket](https://img.shields.io/badge/WebSocket-enabled-brightgreen)
![Express](https://img.shields.io/badge/Express.js-Server-lightgrey)

## Overview

**QuickTalk** is a real-time chat application. This repository contains the **WebSocket server** for QuickTalk, built with [Express](https://expressjs.com/) and the native [ws](https://github.com/websockets/ws) WebSocket library for lightweight and efficient real-time messaging.

---
## Live
https://quickt4lk.vercel.app/


## Features

- **Real-time Communication:** Fast, bidirectional messaging over WebSockets.
- **Express Integration:** HTTP endpoints for RESTful API needs.
- **User and Room Management:** Support for multiple chat rooms and dynamic user join/leave.
- **Lightweight & Scalable:** Efficient TypeScript codebase for easy maintenance and scalability.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/Anmolwalia07/QuickTalk.git
cd QuickTalk

# Install dependencies
npm install
# or
yarn install
```

### Running the Server

```bash
# Start the development server
npm run dev
# or
yarn dev

# For production build
npm run build
npm start
```

By default, the server runs on `http://localhost:3000` (configurable in your environment variables).

---

## Usage

- Connect to the WebSocket server using a compatible client (e.g., a web browser or custom client).
- Interact with REST endpoints (if available) to manage users, rooms, or messages.

---

## Project Structure

```
/QuickTalk
 ├── backend
 ├── frontend
 └── README.md
```
---

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [ws (WebSocket)](https://github.com/websockets/ws)
- [Node.js](https://nodejs.org/)

---

## Contributing

Contributions are welcome! Please open an issue or pull request for suggestions and improvements.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for more information.

---

## Author

- [Anmol Walia](https://github.com/Anmolwalia07)

---

## Acknowledgements

- [Express](https://expressjs.com/)
- [ws](https://github.com/websockets/ws)
- Community contributions
