class CliError extends Error {
  constructor(message: string, private key?: Symbol) {
    super(message);
    Object.setPrototypeOf(this, CliError.prototype);
    this.name = "CliError";
  }

  public static isInstance(err: any): err is CliError {
    if (err instanceof CliError) return true;
    return false;
  }

  protected static isChildInstance(key: Symbol, err: any): err is CliError {
    if (CliError.isInstance(err) && err.key === key) return true;
    return false;
  }

  protected static addChildError(name: string) {
    const key = Symbol();

    const ChildError = class extends CliError {
      constructor(message: string) {
        super(message, key);
        this.name = "CliError";
      }

      public static isInstance(err: any): err is CliError {
        return this.isChildInstance(key, err);
      }
    };

    Object.defineProperty(CliError, name, {
      writable: false,
      value: ChildError,
    });
  }

  public static create<T extends string>(errors: readonly T[]) {
    errors.forEach((error) => this.addChildError(error));
    return CliError as typeof CliError & { [K in T]: typeof CliError };
  }
}

const ComposedCliError = CliError.create(["Fatal", "Warn", "Info", "Git"]);

export { ComposedCliError as CliError };
