module.exports = {
  apps: [
    {
      name: "blog-frontend",
      cwd: "/var/www/blog-app/frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "/api"
      },
      max_memory_restart: "300M",
      autorestart: true
    }
  ]
}
