// ============================================================
// CONFIGURAÇÃO CENTRAL DE WHATSAPP
// Para alterar o número, mude apenas aqui:
// ============================================================
export const WHATSAPP_NUMBER = '5516993789775';

/**
 * Gera o link completo do WhatsApp com mensagem pré-preenchida.
 * @param {string} message - Texto da mensagem a ser enviada
 * @returns {string} URL do WhatsApp
 */
export function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Gera o link do WhatsApp com mensagem personalizada para um produto.
 * @param {string} productName - Nome exato do produto
 * @returns {string} URL do WhatsApp com mensagem pronta
 */
export function buildProductWhatsAppLink(productName) {
  const message = `Olá! Tenho interesse na peça: ${productName}. Poderia me passar mais informações?`;
  return buildWhatsAppLink(message);
}

/**
 * Mensagem padrão para o botão geral de contato da página inicial.
 */
export const HOME_WHATSAPP_LINK = buildWhatsAppLink(
  'Olá! Vim pelo site e gostaria de conhecer melhor as peças disponíveis. Poderia me passar mais informações?'
);
