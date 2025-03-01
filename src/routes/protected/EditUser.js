import { ObjectId } from "@fastify/mongodb";
import bcrypt from "bcryptjs";

export const EditUser = async (request, reply) => {
    try {

        if (!request.server || !request.server.mongo || !request.server.mongo.db) {
            console.error("MongoDB client is not initialized or connected");
            return reply.code(500).send({ message: "MongoDB is not connected" });
        }

        const db = request?.server?.mongo?.db;
        const usersCollection = db.collection('users');

        const { id } = request.query;

        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return reply.code(404).send({ message: "No user found with this id" });
        }

        const { email, password } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: { email, password: hashedPassword, createdAt: user.createdAt, updatedAt: new Date() } });

        if (result.acknowledged) {
            return reply.code(200).send({ message: "User edited successfully", data: { _id: user._id, email, password, createdAt: user.createdAt, updatedAt: new Date() } });
        }


    } catch (error) {
        return reply.code(500).send({ message: "Error editing user" });
    }
};

export const EditUserSchema = {
    description: "Edit a user",
    tags: ['USER'],
    querystring: {
        type: 'object',

        properties: {
            id: { type: 'string' },
        },
        required: ['id'],
    },
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
            description: 'Users edited successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    }
                },
            },
        },
        404: {
            description: 'No user found with this id',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Error fetching user',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    }
};