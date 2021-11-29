class Http500Error extends Error {
    constructor(error) {
        super(error.message)
        this.code = 500
    }
}

export default Http500Error;