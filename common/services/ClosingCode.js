import { makeLocalStorage } from '../infra/cache/MakeLocalStorage';
import { LocalStorageItems } from '../../constants/LocalStorageItems'

export function closingCode() {
  const localStorage = makeLocalStorage();
  localStorage.remove(LocalStorageItems.FLOOR_PLAN)
}