import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UnauthorizedException
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { ApiOperation } from "@nestjs/swagger"
import type { Request, Response } from "express"
import { lastValueFrom } from "rxjs"

import { AuthClientGrpc } from "./auth.grpc"
import { SendOtpReguest, TelegramConsumeRequest, TelegramVerifyRequest, VerifyOtpRequest } from "./dto"

@Controller("auth")
export class AuthController {
	public constructor(
		private readonly client: AuthClientGrpc,
		private readonly config: ConfigService
	) {}

	@ApiOperation({
		summary: "Send otp code",
		description:
			"Sends a verification code to the user phone number or email."
	})
	@Post("otp/send")
	@HttpCode(HttpStatus.OK)
	public async sendOtp(@Body() dto: SendOtpReguest) {
		return this.client.sendOtp(dto)
	}

	@ApiOperation({
		summary: "Verify otp code",
		description:
			"Verifies the code sent to the phone number or email address and returns a access token"
	})
	@Post("otp/verify")
	@HttpCode(HttpStatus.OK)
	public async verifyOtp(
		@Body() dto: VerifyOtpRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessToken, refreshToken } = await lastValueFrom(
			this.client.verifyOtp(dto)
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: "Refresh access token",
		description: "Renews access token using refresh token from cookies"
	})
	@Post("refresh")
	@HttpCode(HttpStatus.OK)
	public async refresh(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		const refreshToken = req.cookies?.refreshToken

		const { accessToken, refreshToken: newRefreshToken } =
			await lastValueFrom(this.client.refresh({ refreshToken }))

		res.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return { accessToken }
	}

	@ApiOperation({
		summary: "Logout",
		description: "Clears the refresh token cookie and logs the user out"
	})
	@Post("logout")
	@HttpCode(HttpStatus.OK)
	public async logout(@Res() res: Response) {
		res.cookie("refreshToken", "", {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			expires: new Date(0)
		})

		return {
			ok: true
		}
	}

	@ApiOperation({
		summary: "Init Telegram login",
		description:
			"Initiates the authentication process via Telegram and prepares the session state."
	})
	@Get("auth/telegram")
	@HttpCode(HttpStatus.OK)
	public async telegramInit() {
		return this.client.telegramInit()
	}

	@ApiOperation({
		summary: "Verify Telegram login",
		description:
			"Verifies the Telegram authentication payload. Upon successful verification, sets an HTTP-only refresh token cookie and returns the access token."
	})
	@Post("telegram/verify")
	@HttpCode(HttpStatus.OK)
	public async telegramVerify(
		@Body() dto: TelegramVerifyRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const query = JSON.parse(atob(dto.tgAuthResult))

		const result = await lastValueFrom(
			this.client.telegramVerify({ query })
		)

		if ("url" in result && result.url) {
			return result
		}

		if (
			"accessToken" in result &&
			"refreshToken" in result &&
			result.accessToken &&
			result.refreshToken
		) {
			const { accessToken, refreshToken } = result

			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: this.config.get("NODE_ENV") !== "development",
				domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
				sameSite: "lax",
				maxAge: 30 * 24 * 60 * 60 * 1000
			})

			return {
				accessToken
			}
		}

		throw new UnauthorizedException("Invalid Telegram login response")
	}

	@ApiOperation({
        summary: "Finalize Telegram authentication",
        description: "Accepts a session identifier (sessionId) verified by the Telegram bot and exchanges it for JWT tokens. The refresh token is automatically set in a secure httpOnly cookie, while the access token is returned in the response body."
    })
	@Post("telegram/finalize")
	@HttpCode(HttpStatus.OK)
	public async consume(
		@Body() dto: TelegramConsumeRequest,
		@Res({ passthrough: true }) res: Response
	) {
		const { accessToken, refreshToken } = await lastValueFrom(
			this.client.consume(dto)
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: this.config.get("NODE_ENV") !== "development",
			domain: this.config.getOrThrow<string>("COOKIES_DOMAIN"),
			sameSite: "lax",
			maxAge: 30 * 24 * 60 * 60 * 1000
		})

		return {
			accessToken
		}
	}
}
