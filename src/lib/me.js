// auth/me.js
import { getUserFromReq } from '.auth'

export default async function handler(req, res) {
    const user = await getUserFromReq(req)
    if (!user) return res.status(401).json({ ok: false })

    res.status(200).json({ ok: true, user })
}
