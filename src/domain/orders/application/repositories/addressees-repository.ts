import { Addressee } from '../../enterprise/entities/addressee'

export abstract class AddresseesRepository {
  abstract findById(id: string): Promise<Addressee | null>
  abstract save(addressee: Addressee): Promise<void>
  abstract create(addressee: Addressee): Promise<void>
  abstract delete(addressee: Addressee): Promise<void>
}
