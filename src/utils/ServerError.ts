export interface ServerErrorInterface {
  code: number;
  message: string;
}

export class ServerError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(message);
    this.name = 'ServerError';
  }
}