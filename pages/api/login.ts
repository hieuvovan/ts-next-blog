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
  return new Promise((resolve) => {
    // Don't send cookie to API server
    // req.headers.cookie = ''

    const handleLoginResponse: ProxyResCallback = (proxyRes, req, res) => {
      try {
        let body = ''
        proxyRes.on('data', function (chunk) {
          body += chunk
        })

        proxyRes.on('end', function () {
          const { accessToken, expiredAt } = JSON.parse(body)
          // Convert token to cookies
          const cookies = new Cookies(req, res, {
            secure: process.env.NODE_ENV !== 'development',
          })
          cookies.set('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            expires: new Date(expiredAt),
          })
          ;(res as NextApiResponse)
            .status(200)
            .json({ message: 'Login successfully' })
        })
      } catch (error) {
        ;(res as NextApiResponse)
          .status(500)
          .json({ message: 'Something went wrong' })
      }

      resolve(true)
    }
    proxy.once('proxyRes', handleLoginResponse)

    // Foward
    proxy.web(req, res, {
      target: process.env.API_URL,
      changeOrigin: true,
      selfHandleResponse: true,
    })
  })
}
