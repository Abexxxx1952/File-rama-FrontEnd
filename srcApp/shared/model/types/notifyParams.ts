export type NotifyParams =
  | {
      isError: true;
      responseResult: Record<string, any> | null;
      successMessage?: never;
    }
  | {
      isError: false;
      responseResult?: never;
      successMessage: string;
    };
