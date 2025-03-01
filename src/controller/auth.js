import { fileUpload, fileUploadSchema } from "../routes/fileUpload";
import { Login, loginSchema } from "../routes/login";
import { DeleteUser, DeleteUserSchema } from "../routes/protected/DeleteUser";
import { EditUser, EditUserSchema } from "../routes/protected/EditUser";
import { GetUSers, getUsersSchema } from "../routes/protected/getusers";

export const auth1 = async (fastify, options) => {


    fastify.route({ method: "POST", url: "/api/login", handler: Login, schema: loginSchema });

    
    
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify();
        } catch (err) {
            return reply.code(401).send({ message: "Unauthorized" });
        }
    });
    
    fastify.route({ method: "POST", url: "/api/Upload", handler: fileUpload, schema: fileUploadSchema , preValidation: [fastify.authenticate] });
    fastify.route({ method: "GET", url: "/api/users", handler: GetUSers, schema: getUsersSchema, preValidation: [fastify.authenticate] });
    fastify.route({ method: "PUT", url: "/api/users", handler: EditUser, schema: EditUserSchema, preValidation: [fastify.authenticate] });
    fastify.route({ method: "DELETE", url: "/api/users", handler: DeleteUser, schema: DeleteUserSchema, preValidation: [fastify.authenticate] });
};
