import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
const live = 'https://mesa-calendario-catering.jdelsol-91.chatgpt.site'
export default defineConfig({
  plugins: [react(), {name:'gestion',configureServer(server) {
    server.middlewares.use((req,res,next) => {
      if (req.url?.split('?')[0] === '/gestion') {res.writeHead(302,{Location:live+'/gestion'});res.end();return}
      next()
    })
  }}],
  server:{proxy:{'/api':{target:'http://127.0.0.1:4318',changeOrigin:true}}}
})
