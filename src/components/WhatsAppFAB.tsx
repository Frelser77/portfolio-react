import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { buildWhatsAppUrl } from './WhatsAppContact';

const WhatsAppFAB = () => {
  const { t } = useTranslation();
  const waUrl = buildWhatsAppUrl(t('whatsapp_message'));

  return (
    <motion.a
      href={waUrl}
      target='_blank'
      rel='noreferrer'
      aria-label='Scrivimi su WhatsApp'
      title='Scrivimi su WhatsApp'
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed',
        bottom: '5rem',
        right: '1.5rem',
        zIndex: 1000,
        width: 56,
        height: 56,
        borderRadius: '50%',
        background: '#25D366',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4), 0 0 0 3px rgba(37,211,102,0.35)',
        textDecoration: 'none',
      }}
    >
      <FaWhatsapp size={28} />
    </motion.a>
  );
};

export default WhatsAppFAB;
