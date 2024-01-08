export class ApiResponse<T> {
  constructor(
    public isSuccess: boolean,
    public message: string,
    public statusCode: number,
    public result: T,
    public errors?: any[],
  ) {}

  public static Success<T>(
    result: T,
    statusCode: number = 200,
    message: string = 'Success',
  ): ApiResponse<T> {
    return new ApiResponse(true, message, statusCode, result);
  }

  public static Failure<T>(
    errors: any[],
    statusCode: number = 400,
    message: string = 'Something went wrong',
  ): ApiResponse<T> {
    return new ApiResponse(false, message, statusCode, null, errors);
  }
}
