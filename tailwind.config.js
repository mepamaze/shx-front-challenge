module.exports = {
    purge: [
        './src/**/*.html',
        './src/**/*.js',
      ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        minHeight: {
            '1px': '1px',
        }
      },
    },
    variants: {},
    plugins: [],
  }
