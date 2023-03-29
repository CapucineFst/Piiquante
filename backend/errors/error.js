/**
 * Catch the error message and return it in a clearer way
 * @param {object} error 
 * @returns object message
 */
const getErrorMessage = (error) => {
    if (error.errors !== undefined && error.errors.isArray()) {
        const messages = error.errors.map(e => e.message);
        return { message : messages.join(',')};
    }
    if(error.message !== undefined) 
    {
        return {message : error.message};
    }
    return {message : 'erreur inconnue'};
};

module.exports = getErrorMessage;