import {
	type ValidationArguments,
	ValidatorConstraint,
	type ValidatorConstraintInterface
} from "class-validator"

import { SendOtpReguest } from "@/modules/auth/dto"

@ValidatorConstraint({ name: "IdentifierValidator", async: false })
export class IdentifierValidator implements ValidatorConstraintInterface {
	public validate(value: string, args: ValidationArguments): boolean {
		const object = args.object as SendOtpReguest

		if (object.type === "email") {
			return (
				typeof value === "string" &&
				/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
			)
		} else if (object.type === "phone") {
			return typeof value === "string" && /^\+[1-9]\d{6,14}$/.test(value)
		}

		return false
	}

	public defaultMessage(args: ValidationArguments): string {
		const object = args.object as SendOtpReguest

		if (object.type === "email") {
			return "identifier must be a valid email"
		}

		if (object.type === "phone") {
			return "identifier must be a valid phone number"
		}

		return "Invalid identifier"
	}
}
