
export const responseData = (res, statusCode, successType, message, data = null) => {
    return res.status(statusCode).json({
        success: successType,
        message: message,
        data: data,
    });
};
