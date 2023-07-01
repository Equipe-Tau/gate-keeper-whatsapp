import dotenv from 'dotenv';

export class ENV {

  public static initialized = false;

  public static get(index?: keyof ENVInterface): ENVInterface {
    if (!this.initialized) {
      dotenv.config();
    }

    return (index ?
      process?.env[index] :
      process.env
    ) as unknown as ENVInterface
  }

}

export interface ENVInterface {
  PORT: number;
}