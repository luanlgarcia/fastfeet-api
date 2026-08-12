import { InMemoryDeliveryPhotosRepository } from 'test/repositories/in-memory-delivery-photos-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InvalidPhotoTypeError } from './errors/invalid-photo-type-error'
import { UploadDeliveryPhotoUseCase } from './upload-delivery-photo'

let inMemoryDeliveryPhotosRepository: InMemoryDeliveryPhotosRepository
let fakeUploader: FakeUploader

let sut: UploadDeliveryPhotoUseCase

describe('Upload Delivery Photo', () => {
  beforeEach(() => {
    inMemoryDeliveryPhotosRepository = new InMemoryDeliveryPhotosRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadDeliveryPhotoUseCase(
      inMemoryDeliveryPhotosRepository,
      fakeUploader,
    )
  })

  it('should be able to upload a delivery photo', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryPhoto: inMemoryDeliveryPhotosRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload a delivery photo with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidPhotoTypeError)
  })
})
