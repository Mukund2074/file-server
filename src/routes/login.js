import bcrypt from "bcryptjs";

export const Login = async (request, reply) => {
    try {

        if (!request.server || !request.server.mongo || !request.server.mongo.db) {
            console.error("MongoDB client is not initialized or connected");
            return reply.code(500).send({ message: "MongoDB is not connected" });
        }

        const db = request?.server?.mongo?.db;
        const usersCollection = db.collection('users');

        const { email, password } = request.body;

        const user = await usersCollection.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!user) {
            return reply.code(404).send({ message: "User not found" });
        }
        if (!isPasswordValid) {
            return reply.code(401).send({ message: "Invalid password" });
        }

        const auth_token = await reply.jwtSign({ email: user.email }, { expiresIn: '1h' });

        return reply.code(200).send({ message: "Login successful", data: { email, auth_token } });

    } catch (error) {

    }
}

export const loginSchema = {
    description: "Login a user",
    tags: ['USER'],
    body: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
        required: ['email', 'password'],
    },
    response: {
        200: {
            description: 'User logged in successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        auth_token: { type: 'string' }
                    }
                },
            },
        },
        401: {
            description: 'Invalid credentials',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        404: {
            description: 'User not found',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Internal server error',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
}