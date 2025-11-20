// tailwind.config.js
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      '3xl': '1600px',
      '4xl': '1820px',
    },
    extend: {
      maxWidth: {
        '8xl': '90rem', // 1440px
        '9xl': '96rem', // 1536px
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        active: 'var(--color-active)',
        nonactive: 'var(--color-nonactive)',
        heading: 'var(--color-heading)',
        subheading: 'var(--color-subheading)',
        header: 'var(--color-header-bg)',
        navbar: 'var(--color-navbar-bg)',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Urbanist', 'sans-serif'],
        body: ['var(--font-body)', 'Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
};
