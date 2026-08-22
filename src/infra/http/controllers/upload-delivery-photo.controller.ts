import { InvalidPhotoTypeError } from '@/domain/orders/application/use-cases/errors/invalid-photo-type-error'
import { UploadDeliveryPhotoUseCase } from '@/domain/orders/application/use-cases/upload-delivery-photo'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/delivery-photos')
export class UploadDeliveryPhotoController {
  constructor(private uploadDeliveryPhoto: UploadDeliveryPhotoUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, //2mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadDeliveryPhoto.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidPhotoTypeError:
          throw new UnsupportedMediaTypeException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { deliveryPhoto } = result.value

    return {
      deliveryPhotoId: deliveryPhoto.id.toString(),
    }
  }
}
