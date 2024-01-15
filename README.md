# Online Ticket Store Microservices

This project is an Online Ticket Store microservices application written in TypeScript and JavaScript. It includes Docker files and configurations, as well as Nginx files. The project is structured into folders for each microservice:

- [auth](./auth)
- [client](./client)
- [expiration](./expiration)
- [infra](./infra)
- [nats-test](./nats-test)
- [orders](./orders)
- [payments](./payments)
- [tickets](./tickets)

## Overview

The **Online Ticket Store Microservices** project is a comprehensive solution for managing an online ticketing platform. Built with TypeScript and JavaScript, this microservices architecture allows for scalability, maintainability, and ease of deployment. The system is designed to handle various aspects of an online ticket store, including user authentication, client interfaces, order processing, payment handling, and more.

### Key Features

- **Microservices Architecture:** The project is divided into individual microservices, each responsible for specific functionality, fostering modularity and independent development.

- **Docker Integration:** Leveraging Docker for containerization, the project ensures consistent and reproducible environments across different stages of development and deployment.

- **Nginx for Load Balancing:** Nginx is employed for load balancing, optimizing resource utilization, and providing a seamless experience for users even during high traffic.

- **NATS Event Bus:** The project utilizes the NATS event bus for efficient communication and event-driven architecture between microservices, enhancing decoupling and scalability.

- **TypeScript and JavaScript:** Utilizing TypeScript for static typing and enhanced developer experience, the project offers a blend of JavaScript for flexibility and familiarity.

### Purpose

The primary goal of the Online Ticket Store is to provide a flexible, scalable, and maintainable solution for businesses in the entertainment and event industry. Whether you're managing ticket sales for concerts, sports events, or theater productions, this microservices architecture ensures a robust foundation for your online ticketing needs.

## Technologies Used

- TypeScript
- JavaScript
- NodeJS
- MongoDB
- Jest
- Docker
- Kubernetes
- Nginx


Each microservice is contained in its respective folder, housing its code, Docker files, and configurations.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/sukhbir77/TicketSystem.git
```

Feel free to contribute, report issues, or enhance existing features to make the Online Ticket Store Microservices project even more powerful and user-friendly.



