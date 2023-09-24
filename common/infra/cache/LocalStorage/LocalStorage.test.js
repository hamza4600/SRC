import 'jest-localstorage-mock'
import { LocalStorage } from './LocalStorage'
import faker from '@faker-js/faker'

const createSubject = () => {
  return new LocalStorage();
}

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  })

  it("should call localStorage.getItem with correct values", () => {
    const subject = createSubject();
    const key = faker.database.column();
    const localStorageValue = faker.random.objectElement<{}>('')
    const getItemSpyy = jest.spyOn(localStorage, 'getItem').mockReturnValueOnce(
      JSON.stringify(localStorageValue)
    )

    const localStorageGet = subject.get(key);

    expect(localStorageGet).toEqual(localStorageValue);
    expect(getItemSpyy).toHaveBeenCalledWith(key);
  })

  it("should call localStorage.setItem with correct values", () => {
    const subject = createSubject();
    const key = faker.database.column();
    const value = "https://fake-value.com"

    subject.set(key, value)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      key, JSON.stringify(value)
    )
  })

  it("should call localStorage.removeItem correctly", () => {
    const subject = createSubject();
    const key = faker.database.column();

    subject.remove(key);

    expect(localStorage.removeItem).toHaveBeenCalledWith(key)
  })
})