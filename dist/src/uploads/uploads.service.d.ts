import { ConfigService } from '@nestjs/config';
export interface UploadResult {
    url: string;
    publicId: string;
    format: string;
    bytes: number;
}
export declare class UploadsService {
    private readonly config;
    constructor(config: ConfigService);
    uploadFile(fileBuffer: Buffer, folder: string, originalName: string): Promise<UploadResult>;
    deleteFile(publicId: string): Promise<void>;
}
