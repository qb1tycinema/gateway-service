import { BadRequestException } from "@nestjs/common"
import type { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface"

export const AvatarUploadOptions: MulterOptions = {
	limits: {
		fileSize: 10 * 1024 * 1024
	},
	fileFilter: (
		_: any,
		file: Express.Multer.File,
		cb: (error: Error | null, acceptFile: boolean) => void
	) => {
		if (file.mimetype.match(/^image\/(jpg|jpeg|png|webp|gif)$/i)) {
			cb(null, true)
		} else {
			cb(
				new BadRequestException(
					"Разрешены только изображения форматов: JPG, JPEG, PNG, WEBP, GIF"
				),
				false
			)
		}
	}
}
