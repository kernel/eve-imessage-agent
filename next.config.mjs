import { withEve } from "eve/next"

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default withEve(nextConfig)
