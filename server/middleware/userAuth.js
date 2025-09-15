import jwt from "jsonwebtoken"

export const userAuth = async (req, res, next) => {
  const { token } = req.cookies

  console.log("All cookies:", req.cookies)
  console.log("Token from cookies:", token)
  console.log("Headers:", req.headers.cookie)

  if (!token) {
    console.log("token not found")
    return res.status(401).json({ message: "Unauthorized - No token provided" })
  }
  try {
    const decodedtoken = jwt.verify(token, process.env.JWT_SECRET)
    if (decodedtoken.id) {
      req.user = { id: decodedtoken.id }
      console.log("Authenticated user:", req.user)
      console.log("token id found")
    } else {
      console.log("token id not found")
      return res.status(401).json({ message: "Unauthorized - Invalid token structure" })
    }
    next()
  } catch (error) {
    console.log("JWT verification error:", error.message)
    console.log("Token that failed:", token)
    return res.status(401).json({ message: "Unauthorized - Token verification failed" })
  }
}
