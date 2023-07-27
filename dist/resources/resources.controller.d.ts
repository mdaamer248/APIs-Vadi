import { StreamableFile } from '@nestjs/common';
import type { Response } from 'express';
export declare class ResourcesController {
    getFile(res: Response): StreamableFile;
}
