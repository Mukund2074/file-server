import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { auth1 } from "./src/controller/auth";
import fastifyMongodb from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import fastifyWebsocket from "@fastify/websocket";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import fastifyCors from "@fastify/cors";


const server = async () => {
  const fastify = Fastify({ logger: false });
  const PORT = process.env.PORT || 8000;

  fastify.register(fastifyCors, {
    origin: "*",
  });

  fastify.register(fastifySwagger, {
    routePrefix: "/docs",
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "FILE UPLOAD SERVER",
        description: "API documentation for FILE UPLOAD SERVER BY MUKUND HADIYA",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: "Local server"
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
  });

  fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
  })

  fastify.register(fastifySwaggerUI, { routePrefix: "/docs" });

  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'uploads'),
    prefix: '/uploads/'
  })


  fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,  // 10MB limit for files
    }
  });


  fastify.register(fastifyWebsocket, {
    options: {
      maxPayload: 10 * 1024 * 1024,
    },
  });

  fastify.register(fastifyMongodb, {
    forceClose: true,
    url: process.env.DATABASE_URI,
  });

  fastify.addHook('onReady', async () => {
    try {
      const db = fastify.mongo.db;
      console.log("MongoDB connection established TO Database name:", db.databaseName);
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);
    }
  });

  fastify.register(auth1);

  fastify.get("/", (request, reply) => {
    return { message: "This is a Fastify server" };
  });

  try {
    const server = await fastify.listen({ port: PORT });
    console.log(`Server started on server=${server} port=${PORT}`);
  } catch (error) {
    fastify.log.error("Error starting server:", error);
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

server();
