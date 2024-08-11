
// const responseHandler = (func) => {
//     function handler(req, res, next) {
//         Promise.resolve(func(re,res,next)).catch(next)
//     }
//     return handler;
// }
const responseHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            console.log(error.name)
            if(error.name=='ValidationError'){
                error.statusCode=400;
            }
            res.status(error.statusCode || 500
            ).json({
                success: false,
                message: error.message
            })
        }
    }
}
module.exports = responseHandler;
