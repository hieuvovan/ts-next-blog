// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import httpProxy from 'http-proxy'

// Create proxy
const proxy = httpProxy.createProxyServer()

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  // Don't send cookie to API server
  req.headers.cookie = ''

  // Foward
  proxy.web(req, res, {
    target: process.env.API_URL,
    changeOrigin: true,
    selfHandleResponse: false,
  })
}
