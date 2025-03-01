import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export const fileUpload = async (request, reply) => {
    try {
        const data = await request.parts();

        const uploadedFiles = []; // Initialize uploadedFiles array

        for await (const part of data) {
            if ('file' in part && 'filename' in part) {
                const uid = uuidv4();
                const docName = `${uid}_${part.filename}`;

                const filePath = path.join(process.cwd(), 'public', 'uploads', docName);

                // Ensure the directory exists
                const dirPath = path.dirname(filePath);
                if (!fs.existsSync(dirPath)) {
                    fs.mkdirSync(dirPath, { recursive: true });
                }

                const writeStream = fs.createWriteStream(filePath);
                await part.file.pipe(writeStream);
                await new Promise((resolve, reject) => {
                    part.file.on('end', resolve);
                    part.file.on('error', reject);
                });

                uploadedFiles.push(docName);
            } else {
                throw new Error('Invalid file type');
            }
        }

        if (uploadedFiles.length > 0) {
            return reply.code(200).send({ message: "Files uploaded successfully", uploadedFiles });
        } else {
            return reply.code(400).send({ message: "No files uploaded" });
        }
    } catch (error) {
        console.error(error);
        return reply.code(500).send({ message: "Failed to upload files" });
    }
}

export const fileUploadSchema = {
    description: "Upload multiple profile images",
    tags: ['UPLOAD'],
    consumes: ['multipart/form-data'],
    body: {},
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                uploadedFiles: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
        },
    }
};
