module.exports = {
  purge: [
    './*.html',
    './*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderRadius: {
      'none': '0',
      'sm': '.125rem',
      DEFAULT: '.25rem',
      'lg': '.5rem',
      'full': '9999px',
    },
    container : {
      padding: '2rem'
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}