// utils/gerarId.js

// Usa Web Crypto API quando disponível (mais seguro/único). Caso contrário, usa Math.random().
function gerarId(tamanho = 20) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLen = chars.length;
  
    // Se a API crypto estiver disponível (React Native com expo >= certo nível pode ter globalThis.crypto)
    try {
      if (typeof globalThis?.crypto?.getRandomValues === 'function') {
        const randomBytes = new Uint8Array(tamanho);
        globalThis.crypto.getRandomValues(randomBytes);
        let id = '';
        for (let i = 0; i < tamanho; i++) {
          id += chars[randomBytes[i] % charsLen];
        }
        return id;
      }
    } catch (e) {
      // se falhar, continua para fallback
    }
  
    // Fallback simples com Math.random
    let id = '';
    for (let i = 0; i < tamanho; i++) {
      id += chars.charAt(Math.floor(Math.random() * charsLen));
    }
    return id;
  }
  
  // Export named e default — assim evita problemas na importação
  export { gerarId };
  export default gerarId;
  