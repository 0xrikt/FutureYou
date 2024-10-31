// src/components/ui/Footer.tsx
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-4">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center space-y-3">
          {/* Divider */}
          <div className="w-24 mx-auto border-t border-gray-200"></div>
          
          {/* Social Links */}
          <div className="flex justify-center gap-3 flex-wrap">
            {/* 小红书 */}
            <Link
              href="https://www.xiaohongshu.com/user/profile/5ba4bc246574cf0001d3321e"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-3 py-1.5 
                       rounded-md border border-gray-100 bg-white/50
                       hover:border-gray-200 hover:bg-gray-50
                       transition-all duration-200"
            >
              <span className="mr-1.5 group-hover:scale-110 transition-transform duration-200">📓</span>
              <span className="text-sm text-gray-600 font-light group-hover:text-gray-900">
                小红书 @Richi
              </span>
            </Link>
            
            {/* 即刻 */}
            <Link
              href="https://okjk.co/jA3knM"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-3 py-1.5 
                       rounded-md border border-gray-100 bg-white/50
                       hover:border-gray-200 hover:bg-gray-50
                       transition-all duration-200"
            >
              <span className="mr-1.5 group-hover:scale-110 transition-transform duration-200">✨</span>
              <span className="text-sm text-gray-600 font-light group-hover:text-gray-900">
                即刻 @Rik5
              </span>
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-gray-400 text-xs font-light">
            © 2024 AISelf
          </div>
        </div>
      </div>
    </footer>
  );
}


