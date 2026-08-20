import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const CurrentUser = createParamDecorator(
    (data: keyof Request["user"], context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest<Request>()
        const user = request.user

        if (!user) {
            return null
        }

        return data ? user[data] : user
    }
)