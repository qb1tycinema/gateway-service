# 🚪 Gateway Service

The **API Gateway** serves as the single entry point for all client applications interacting with the microservice ecosystem. It acts as a facade and an edge controller, completely hiding the complex internal infrastructure from the outside world.

## 🎯 Architectural Role

In a microservices architecture, clients (web interfaces, mobile apps) shouldn't need to know how many internal services exist, where they are located, or what they are called. The client communicates exclusively with the Gateway. 

The Gateway handles all the edge-level heavy lifting, allowing internal microservices to remain isolated, secure, and strictly focused on their core business logic.

### Core Responsibilities:

*   **Routing:** Receives incoming external requests and dynamically routes them to the appropriate internal microservice.
*   **Protocol Translation:** Acts as a bridge between protocols. It accepts standard HTTP (REST/GraphQL) requests from external clients and communicates with internal services using high-performance binary protocols (e.g., **gRPC**).
*   **Security Termination:** Acts as the first line of defense. It validates authorization tokens (JWT), verifies access rights, and drops unauthorized or malformed requests before they can enter the internal network.
*   **Data Aggregation (API Composition):** If a client requires data from three different services to render a single view, the Gateway can orchestrate those internal calls in parallel, stitch the results into a unified JSON response, and return it to the client. This reduces latency and saves client bandwidth.
*   **Protection & Stability:** Enforces Rate Limiting, handles CORS configurations, and provides basic protection against traffic spikes or abuse.

## 🛠 Tech Stack

*   **Framework:** NestJS
*   **External Interface (Client-facing):** HTTP / REST 
*   **Internal Transport (Service-to-Service):** gRPC (via shared contracts library)

## 🚀 Quick Start

Install dependencies:
```bash
yarn install
