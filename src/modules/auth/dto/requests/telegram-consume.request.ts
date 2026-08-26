import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TelegramConsumeRequest {
    @ApiProperty({
        example: "537653469ccfee5cb38eed4b5299ad02"
    })
    @IsString()
    @IsNotEmpty()
    public sessionId!: string
}