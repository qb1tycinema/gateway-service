import { Injectable } from "@nestjs/common"
import type { ClientGrpc } from "@nestjs/microservices"
import { AbstractGrpcClient, InjectGrpcClient } from "@qb1tycinema/common"
import type {
	MediaServiceClient,
	UploadRequest
} from "@qb1tycinema/contracts/gen/media"
import type { Multer } from "multer"
import { PinoLogger } from "nestjs-pino"
import { catchError, lastValueFrom, Subject, throwError, timeout } from "rxjs"

@Injectable()
export class MediaClientGrpc extends AbstractGrpcClient<MediaServiceClient> {
	private readonly CHUNK_SIZE = 64 * 1024

	public constructor(
		@InjectGrpcClient("MEDIA_PACKAGE") client: ClientGrpc,
		private readonly logger: PinoLogger
	) {
		super(client, "MediaService")
	}

	public async upload(file: Express.Multer.File, folder: string) {
		const subject = new Subject<UploadRequest>()
		const response$ = this.service.upload(subject.asObservable()).pipe(
			timeout(5000),
			catchError(err => {
				this.logger.error({ err }, "Stream failed or timed out")
				return throwError(() => err)
			})
		)

		subject.next({
			metadata: {
				fileName: file.originalname,
				folder,
				contentType: file.mimetype
			}
		})

		this.streamChunks(file.buffer, subject)

		return await lastValueFrom(response$)
	}

	private streamChunks(buffer: Buffer, subject: Subject<UploadRequest>) {
		let offset = 0

		try {
			while (offset < buffer.length) {
				const chunk = buffer.subarray(offset, offset + this.CHUNK_SIZE)
				subject.next({ chunkData: new Uint8Array(chunk) })
				offset += this.CHUNK_SIZE
			}

			subject.complete()
		} catch (error) {
			subject.error(error)
			throw error
		}
	}
}
