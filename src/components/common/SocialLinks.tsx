import React from 'react';
import { useMSSNStore } from '../../hooks/useMSSNStore';
import { ExternalLink } from 'lucide-react';

interface SocialLinksProps {
  variant?: 'header' | 'footer' | 'colored' | 'pills' | 'cards';
  showLabels?: boolean;
  className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  variant = 'footer',
  showLabels = false,
  className = ''
}) => {
  const { siteContent } = useMSSNStore();

  const tiktokUrl =
    siteContent.tiktokUrl ||
    'https://www.tiktok.com/@mssnfud?_r=1&_t=ZS-991TmdMkNKz';
  const facebookUrl =
    siteContent.facebookUrl || 'https://www.facebook.com/share/1KTTAJr5az/';
  const twitterUrl = siteContent.twitterUrl || 'https://x.com/FudMssn';
  const whatsappUrl =
    siteContent.whatsappUrl ||
    'https://wa.me/2348031234567?text=Assalamu%20Alaikum%20MSSN%20FUD%20Secretariat';

  const channels = [
    {
      id: 'tiktok',
      name: 'TikTok',
      handle: '@mssnfud',
      url: tiktokUrl,
      color: 'hover:text-[#00f2fe] hover:bg-black',
      badgeBg: 'bg-black text-white hover:bg-neutral-900 border-neutral-700',
      pillBg: 'bg-black/90 text-white hover:bg-black border border-neutral-700 shadow-xs',
      brandColor: '#000000',
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
        </svg>
      )
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'MSSN FUD Chapter',
      url: facebookUrl,
      color: 'hover:text-blue-500 hover:bg-blue-950/40',
      badgeBg: 'bg-[#1877F2] text-white hover:bg-[#166fe5]',
      pillBg: 'bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 border border-[#1877F2]/30 shadow-xs',
      brandColor: '#1877F2',
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      id: 'x',
      name: 'X (Twitter)',
      handle: '@FudMssn',
      url: twitterUrl,
      color: 'hover:text-slate-100 hover:bg-slate-800',
      badgeBg: 'bg-black text-white hover:bg-neutral-900 border-neutral-700',
      pillBg: 'bg-slate-900 text-white hover:bg-black border border-slate-700 shadow-xs',
      brandColor: '#000000',
      icon: (
        <svg
          className="w-3.5 h-3.5 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      handle: 'Secretariat Helpline',
      url: whatsappUrl,
      color: 'hover:text-emerald-400 hover:bg-emerald-950/40',
      badgeBg: 'bg-[#25D366] text-white hover:bg-[#20bd5a]',
      pillBg: 'bg-[#25D366]/10 text-emerald-800 hover:bg-[#25D366]/20 border border-emerald-300 shadow-xs',
      brandColor: '#25D366',
      icon: (
        <svg
          className="w-4 h-4 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.979-.276-.1-.476-.15-.677.15-.201.3-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.268-.468-2.416-1.492-.893-.797-1.497-1.781-1.673-2.082-.175-.301-.019-.464.132-.614.135-.135.301-.351.451-.527.15-.175.2-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.245-.589-.494-.509-.677-.518-.175-.01-.376-.01-.577-.01-.201 0-.527.075-.802.376-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.229 3.109.15.2 2.122 3.24 5.14 4.544.718.31 1.279.496 1.716.634.722.23 1.378.197 1.898.12.579-.087 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.125-.276-.201-.577-.351zM12.004 21.996h-.008c-1.815 0-3.597-.488-5.158-1.411l-.37-.22-3.834 1.006 1.024-3.738-.241-.383A9.948 9.948 0 0 1 2.004 12c0-5.514 4.486-10 10-10s10 4.486 10 10-4.486 10-10 10zm7.07-17.07C17.185 3.042 14.714 2 12.004 2 6.488 2 2 6.488 2 12c0 1.956.564 3.864 1.633 5.51L2 22l4.632-1.602c1.589.988 3.42 1.598 5.372 1.598 5.516 0 10-4.486 10-10 0-2.71-1.042-5.18-2.93-7.07z" />
        </svg>
      )
    }
  ];

  if (variant === 'pills') {
    return (
      <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
        {channels.map((ch) => (
          <a
            key={ch.id}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${ch.pillBg}`}
            title={`Follow MSSN FUD on ${ch.name}`}
          >
            <span className="shrink-0">{ch.icon}</span>
            <span>{ch.name}</span>
            <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
        {channels.map((ch) => (
          <a
            key={ch.id}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs"
                style={{ backgroundColor: `${ch.brandColor}15`, color: ch.brandColor }}
              >
                {ch.icon}
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900">{ch.name}</h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">{ch.handle}</p>
            </div>
          </a>
        ))}
      </div>
    );
  }

  if (variant === 'header') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        {channels.map((ch) => (
          <a
            key={ch.id}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title={`Follow MSSN FUD on ${ch.name}`}
            aria-label={`MSSN FUD on ${ch.name}`}
          >
            {ch.icon}
          </a>
        ))}
      </div>
    );
  }

  // Default / Footer variant
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {channels.map((ch) => (
        <a
          key={ch.id}
          href={ch.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 text-xs font-medium cursor-pointer group shadow-xs"
          title={`Follow MSSN FUD on ${ch.name} (${ch.handle})`}
          aria-label={`Follow MSSN FUD on ${ch.name}`}
        >
          <span className="group-hover:scale-110 transition-transform">{ch.icon}</span>
          {showLabels && <span>{ch.name}</span>}
        </a>
      ))}
    </div>
  );
};
