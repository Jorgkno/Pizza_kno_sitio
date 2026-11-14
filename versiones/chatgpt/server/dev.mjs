import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const cwd=fileURLToPath(new URL('..',import.meta.url))
const children=[]
for(const args of [['server/mock.mjs'],['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4317','--strictPort']]) {
 const child=spawn(process.execPath,args,{cwd,stdio:'inherit',env:{...process.env,PORT:'4318'}})
 children.push(child)
 child.on('exit',()=>{for(const c of children)c.kill();process.exit()})
}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{for(const c of children)c.kill();process.exit()})
