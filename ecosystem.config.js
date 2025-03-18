module.exports = {
  apps: [
    {
      name: 'meeting-backend-authorization',
      script: '/home/dtak/nexus-backend/dist/main.js',
      args: 'start -p 3001',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};

