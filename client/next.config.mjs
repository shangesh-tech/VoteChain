/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,

    async redirects() {
        return [
            {
                source: '/redirect',
                destination: '/',
                permanent: true,
            }
        ]
    }
};

export default nextConfig;
