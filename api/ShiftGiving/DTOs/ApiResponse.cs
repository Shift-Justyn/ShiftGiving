namespace ShiftGiving.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public ErrorDetail? Error { get; set; }
    public PaginationMeta? Meta { get; set; }

    public static ApiResponse<T> SuccessResponse(T data, PaginationMeta? meta = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Error = null,
            Meta = meta
        };
    }

    public static ApiResponse<T> ErrorResponse(string code, string message, object? details = null)
    {
        return new ApiResponse<T>
        {
            Success = false,
            Data = default,
            Error = new ErrorDetail { Code = code, Message = message, Details = details },
            Meta = null
        };
    }
}

public class PaginationMeta
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
}

public class ErrorDetail
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Details { get; set; }
}
