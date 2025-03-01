export const GetUSers = async (request, reply) => {

    try {

        if (!request.server || !request.server.mongo || !request.server.mongo.db) {
            console.error("MongoDB client is not initialized or connected");
            return reply.code(500).send({ message: "MongoDB is not connected" });
        }

        const db = request?.server?.mongo?.db;
        const usersCollection = db.collection('users');

        const { email } = request.query;



        let users;
        if (email) {
            users = await usersCollection.find({ email }).toArray();
            if (users.length === 0) {
                return reply.code(404).send({ message: "No user found with this email" });
            }
        } else {
            users = await usersCollection.find({}).toArray();
            if (users.length === 0) {
                return reply.code(404).send({ message: "No users found" });
            }
        }


        if (!users) {
            return reply.code(404).send({ message: "No users found" });
        }

        return reply.code(200).send({ message: "Users fetched successfully", data: users });


    } catch (error) {

        console.error("Error fetching users:", error);
        return reply.code(500).send({ message: "Error fetching users" });

    }
};


export const getUsersSchema = {
    description: "Get all users",
    tags: ['USER'],
    querystring: {
        type: 'object',
        properties: {
            email: { type: 'string', format: 'email' },
        },
    },
    response: {
        200: {
            description: 'Users fetched successfully',
            type: 'object',
            properties: {
                message: { type: 'string' },
                data: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            _id: { type: 'string' },
                            email: { type: 'string' },
                            createdAt: { type: 'string' },
                            updatedAt: { type: 'string' },
                        }
                    }
                },
            },
        },
        404: {
            description: 'No users found',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        500: {
            description: 'Error fetching users',
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
    }
};