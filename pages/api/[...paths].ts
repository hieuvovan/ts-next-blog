// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxy from 'http-proxy'
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
  return new Promise((resolve) => {
    // Convert cookies to Header Auth
    const cookies = new Cookies(req, res)
    const accessToken = cookies.get('accessToken')
    if (accessToken) {
      req.headers.authorization = `Bearer ${accessToken}`
    }
    // Don't send cookie to API server
    req.headers.cookie = ''

    // Foward
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: false,
    })

    proxy.once('proxyRes', () => {
      resolve(true)
    })
  })
}
