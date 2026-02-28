import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  // Mantemos o base para o GitHub Pages (ajuste se mudar o nome do repositório)
  base: '/topmanuais.com.br/', 
  
  plugins: [react()],
  
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    
    // 1. Aumenta o limite de aviso para 1000kb (útil para apps com muitas bibliotecas)
    chunkSizeWarningLimit: 1000, 

    rollupOptions: {
      output: {
        // 2. Divisão de código (Code Splitting)
        // Separa bibliotecas pesadas (react, lucide, etc) do seu código principal.
        // Isso melhora muito o carregamento inicial do site.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        
        // 3. Organização de arquivos de saída
        // Garante que o nome dos arquivos no build seja limpo e padronizado
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`
      },
    },
    
    // 4. Minificação agressiva para carregar o site mais rápido
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs no site final (mais limpo/seguro)
        drop_debugger: true,
      },
    },
  },

  // 5. Configuração do servidor local (opcional, mas ajuda no desenvolvimento)
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});