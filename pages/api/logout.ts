// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxy, { ProxyResCallback } from 'http-proxy'
import Cookies from 'cookies'

export const config = {
  api: {
    bodyParser: false,
  },
}

// Create proxy
const proxy = httpProxy.createProxyServer()

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const cookies = new Cookies(req, res)
  cookies.set('accessToken')

  return res.status(200).json({ message: 'Logout successfully!' })
}
