/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, options) => {
        config.module.rules.push({
            test: /\.pdf$/i,
            type: 'asset/source'
        })
        config.resolve.alias.canvas = false;
    return config;
    },
};

export default nextConfig;
