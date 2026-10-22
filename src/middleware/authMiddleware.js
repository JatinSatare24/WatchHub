import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'


//read token from the request and check if token is valid
const authMiddleware = async (req, res, next) => {
    console.log('middleware reached')

    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies?.jwt) {
        token = req.token.jwt
    }

    if (!token) {
        return res.status(404).json(
            {
                error: 'Not Authorised, no token provided'
            }
        )
    }

    try {
        const decodedJWT = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where: { id: decodedJWT.id }
        })

        if (!user) {
            return res.status(401).json(
                {
                    error: 'User no longer exists'
                }
            )
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(401).json(
            {
                error: 'Not Authorized'
            }
        )
    }
}

export { authMiddleware }