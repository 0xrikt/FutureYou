import localFont from 'next/font/local';

export const notoSansSC = localFont({
  src: [
    {
      path: './fonts/NotoSansSC-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/NotoSansSC-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/NotoSansSC-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
  ],
  variable: '--font-primary',
  display: 'swap',
});