import { useEffect } from "react"
import { useNavigate } from "@shopify/hydrogen/client"
import axios from "axios"

export default function Authentication() {
  const navigate = useNavigate()
  console.log({ navigate })

  const getAuth = async () => {
    try {
      const res = await axios.get("/auth/me", { withCredentials: true })
      throw new Error()
    } catch(err) {
      console.error(err)
      navigate("/login", { replace: true })
    }
  }

  useEffect(() => {
    getAuth()
  }, [])

  return null
}