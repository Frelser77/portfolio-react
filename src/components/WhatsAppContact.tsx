import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp } from 'react-icons/fa';

export const WHATSAPP_NUMBER = '393792242254';

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsMobile(
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
          window.innerWidth < 768
      );
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const WhatsAppContact = () => {
  const { t } = useTranslation();
  const waUrl = buildWhatsAppUrl(t('whatsapp_message'));

  return (
    <div style={{ marginTop: '2rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '0 auto 1.8rem',
          maxWidth: 380,
          opacity: 0.5,
          color: '#fff',
        }}
      >
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
        <span style={{ fontSize: '.75rem', whiteSpace: 'nowrap' }}>{t('whatsapp_or')}</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.5)' }} />
      </div>
      <a
        href={waUrl}
        target='_blank'
        rel='noreferrer'
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: '#25D366',
          color: '#fff',
          borderRadius: 12,
          padding: '.7rem 2rem',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'none',
          boxShadow: '0 4px 18px rgba(37,211,102,0.45)',
        }}
      >
        <FaWhatsapp size={20} />
        {t('whatsapp_cta')}
      </a>
    </div>
  );
};

export default WhatsAppContact;
