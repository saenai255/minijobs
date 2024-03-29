import {BaseError, GenericServerError} from './error';

export class EmptyOptionalError extends GenericServerError {}
type ResOrResFn<T> = (() => T) | T;

export default class Optional<T> {
    static of<T>(item: T | null | undefined): Optional<T> {
        return new Optional(item);
    }

    static readonly empty = Optional.of(null);

    private constructor(private item: T | null | undefined) {
    }

    isEmpty(): boolean {
        return this.item === undefined || this.item === null;
    }

    get(): T | never {
        if (this.isEmpty()) {
            throw new EmptyOptionalError();
        }

        return this.item as T;
    }

    orThrow<Err extends BaseError>(e: ResOrResFn<Err>): T | never {
        if (this.isEmpty()) {
            if (typeof e === 'function') {
                throw e();
            } else {
                throw e;
            }
        }

        return this.item as T;
    }

    orElse(other: T): T {
        if (this.isEmpty()) {
            return other;
        }

        return this.item as T;
    }

    exists(): boolean {
        return !this.isEmpty();
    }
}