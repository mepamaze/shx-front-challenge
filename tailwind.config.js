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
            'sideNav': 'calc(100vh - 112px)'
        },
        minWidth: {
            '350px': '350px'
        }
      },
    },
    variants: {},
    plugins: [],
  }
