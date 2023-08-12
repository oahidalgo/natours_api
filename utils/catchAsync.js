//Takes a function as a parameter               Executes the async function and catches if an error occurs
//                                              then, it'll pass the error to the next middleware (errorController)
module.exports = (fn) => (req, res, next) => fn(req, res, next).catch(next);
