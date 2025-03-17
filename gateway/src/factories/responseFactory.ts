import { HttpStatus } from '@nestjs/common';

export class ResponseFactory {
    private serverTime: Date;

    constructor() {
        const now = new Date();
        const now_utc = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            now.getUTCHours(),
            now.getUTCMinutes(),
            now.getUTCSeconds(),
        );
        this.serverTime = now_utc;
    }

    success(data: any, response: any, defaultStatus: HttpStatus = HttpStatus.OK) {
        const responseObject = {
            data: data,
            meta: {
                serverTime: this.serverTime,
                statusCode: defaultStatus,
                message: defaultStatus === HttpStatus.CREATED ? 'Resource created' : 'Request succeeded',
            },
        };
        response.status(defaultStatus).json(responseObject);
    }

    error(data: any, response: any) {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Request failed - Internal Server Error';
        let errorName = 'InternalServerError';

        if (data.status === HttpStatus.NOT_FOUND) {
            status = HttpStatus.NOT_FOUND;
            message = 'Request failed - Not Found';
            errorName = 'NotFound';
        } else if (data.status === HttpStatus.BAD_REQUEST) {
            status = HttpStatus.BAD_REQUEST;
            message = data.message ? data.message : 'Request failed - Bad Request';
            errorName = 'BadRequest';
        } else if (data.status === HttpStatus.UNAUTHORIZED) {
            status = HttpStatus.UNAUTHORIZED;
            message = 'Request failed - Unauthorized';
            errorName = 'Unauthorized';
        } else if (data.status === HttpStatus.FORBIDDEN) {
            status = HttpStatus.FORBIDDEN;
            message = 'Request failed - Forbidden';
            errorName = 'Forbidden';
        } else {
            message = data.message || message;
            errorName = data.error || errorName;
        }

        const responseObject = {
            error: {
                message: message,
            },
            meta: {
                serverTime: this.serverTime,
                statusCode: status,
            },
        };
        response.status(status).json(responseObject);
    }

    handleResponse(data: any, response: any) {
        if (data.status >= 400) {
            this.error(data, response);
        } else {
            this.success(data, response, response.statusCode);
        }
    }
}