import { Either, left, right } from '@/core/either'
import { DeliveryPhoto } from '../../enterprise/entities/delivery-photo'
import { Injectable } from '@nestjs/common'
import { DeliveryPhotosRepository } from '../repositories/delivery-photos-repository'
import { Uploader } from '../storage/uploader'
import { InvalidPhotoTypeError } from './errors/invalid-photo-type-error'

interface UploadDeliveryPhotoUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadDeliveryPhotoUseCaseResponse = Either<
  InvalidPhotoTypeError,
  {
    deliveryPhoto: DeliveryPhoto
  }
>

@Injectable()
export class UploadDeliveryPhotoUseCase {
  constructor(
    private deliveryPhotosRepository: DeliveryPhotosRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadDeliveryPhotoUseCaseRequest): Promise<UploadDeliveryPhotoUseCaseResponse> {
    if (!/^image\/(jpeg|png)$/.test(fileType)) {
      return left(new InvalidPhotoTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, body, fileType })

    const deliveryPhoto = DeliveryPhoto.create({
      title: fileName,
      url,
    })

    await this.deliveryPhotosRepository.create(deliveryPhoto)

    return right({
      deliveryPhoto,
    })
  }
}
