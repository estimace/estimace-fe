import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        app: path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: parseNumber(env.PORT, 3500),
      proxy: {
        '/api': {
          target: env.API_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

function parseNumber(value: string | undefined, fallback: number) {
  const parsedValue = Number(value)
  if (isNaN(parsedValue)) {
    return fallback
  }
  return parsedValue
}
