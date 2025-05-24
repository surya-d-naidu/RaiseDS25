module.exports = {
  apps: [{
    name: "raiseds25",
    script: "dist/index.js",
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: "80"
    },
    env_development: {
      NODE_ENV: "development",
      PORT: "5000"
    },
    exec_mode: "cluster",
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    restart_delay: 3000
  }]
};