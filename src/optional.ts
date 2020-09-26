
export class Optional<T> {

    private readonly ref: T;

    static of<R>(obj: R) {
        return new Optional<R>(obj);
    }

    constructor(obj: T) {
        this.ref = obj;
    }

    isPresent(): boolean {
        return this.ref !== undefined && this.ref !== null;
    }

    ifPresent(consumer: (obj: T) => any) {
        if (this.isPresent()) {
            consumer(this.ref);
        }
        return this;
    }

    ifPresentOrElse<R>(other: R, consumer: (obj: T | R) => any) {
        if (this.isPresent()) {
            consumer(this.ref);
        } else {
            consumer(other);
        }
    }

    orElesThrow(exception: Error) {
        if (!this.isPresent()) {
            throw exception;
        }
    }

    orElesGet<R>(other: R) {
        return this.isPresent() ? this.ref : other;
    }
}
