import { prisma } from '../config/db.js'
import bcrypt from 'bcryptjs'

const signUp = async (req, res) => {
    const { name, email, password } = req.body

    const userExists = await prisma.user.findUnique({
        where: { email: email }
    })

    if (userExists) {
        return res.status(400).json({ error: 'User already exists with this email' })
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user 
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
            },
        }
    })
}

const login = async (req, res) => {

    const { email, password } = req.body

    const user = await prisma.user.findUnique({
        where: { email: email }
    })

    if (!user) {
        return res.status(401).json({
            error: 'Invalid user or password'
        })
    }

    //verify password

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            error: 'Invalid user or password'
        })
    }

    //Generate JWT token

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                email: email,
            },
        }
    })
}

export { signUp, login }