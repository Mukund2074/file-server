import { ObjectId } from "@fastify/mongodb";

export const DeleteUser = async (request, reply) => {
    try {
        if (!request.server || !request.server.mongo || !request.server.mongo.db) {
            console.error("MongoDB client is not initialized or connected");
            return reply.code(500).send({ message: "MongoDB is not connected" });
        }

        const db = request?.server?.mongo?.db;
        const usersCollection = db.collection('users');

        const { id } = request.query;

        const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

        if (!isValidObjectId(id)) {
            return reply.code(400).send({ message: "Invalid user id" });
        }


        const user = await usersCollection.findOne({ _id: new ObjectId(id) });
        if (!user) {
            return reply.code(404).send({ message: "No user found with this id" });
        }

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.acknowledged) {
            return reply.code(200).send({ message: "User deleted successfully" });
        } else {
            return reply.code(500).send({ message: "Failed to delete user" });
        }
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ message: "Internal server error" });
    }
}

export const DeleteUserSchema = {
    description: "Delete a user",
    tags: ['USER'],
    querystring: {
        type: 'object',
        properties: {
            id: { type: 'string' },
        },
        required: ['id'],
    },
    response: {
        200: {
            description: 'User deleted successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
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
            description: 'Failed to delete user',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    },
}