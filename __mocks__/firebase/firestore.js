import { jest } from '@jest/globals';

export const getFirestore = jest.fn(() => ({}));
export const collection = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const onSnapshot = jest.fn();
export const doc = jest.fn();
export const updateDoc = jest.fn();
