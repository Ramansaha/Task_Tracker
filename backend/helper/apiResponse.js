export const successResponse = function (res, msg) {
    let responseData = {
        status : 200,
        message : msg
    }
    logResponse(responseData)
    return res.status(200).json(responseData)
}

export const partialResponse = function (res, msg) {
    let responseData = {
        status : 206,
        message : msg
    }
    logResponse(responseData)
    return res.status(206).json(responseData)
}

export const successResponseWithData = function (res, msg, data) {
    let responseData = {
        status : 200,
        message : msg,
        data : data
    }
    logResponse(responseData)
    return res.status(200).json(responseData)
}

export const errorResponse = function (res, msg, err) {
    let responseData = {
        status : 500,
        message : msg,
        Error : err
    }
    logResponse(responseData)
    return res.status(500).json(responseData)
}

export const notFoundResponse = function (res, msg, data = {}) {
    let responseData = {
        status : 404,
        message : msg,
        data
    }
    logResponse(responseData)
    return res.status(404).json(responseData)
}

export const validationErrorWithData = function (res, msg, data) {
    let responseData = {
        status : 400,
        message : msg,
        data : data
    }
    logResponse(responseData)
    return res.status(400).json(responseData)
}

export const validationError = function (res, msg) {
    let responseData = {
        status : 400,
        message : msg,
    }
    logResponse(responseData)
    return res.status(400).json(responseData)
}

export const unAuthorizedResponse = function (res, msg) {
    let responseData = {
        status : 401,
        message : msg,
    }
    logResponse(responseData)
    return res.status(401).json(responseData)
}

export const duplicateResponse = function (res, msg) {
    let responseData = {
        status : 409,
        message : msg,
    }
    logResponse(responseData)
    return res.status(responseData.status).json(responseData)
}

export const customResponse = function (res, msg, data, info) {
    let responseData = {
        status : 400,
        message : msg,
        data : data,
        info
    }
    logResponse(responseData)
    return res.status(400).json(responseData)
}

export const somethingResponse = function (res, info) {
    let responseData = {
        status : 400,
        message : "Something went wrong! Please try again later.",
        info
    }
    logResponse(responseData)
    return res.status(400).json(responseData)
}

function logResponse(_responseData) {
    console.error('==========================================================\n')
}