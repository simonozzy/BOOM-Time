const port = process.env.PORT || 8080;

module.exports = {
  source: {
    soapUrl: 'http://lite.realtime.nationalrail.co.uk/OpenLDBWS/ldb9.asmx',
    accessToken: '2b80aa61-db7f-485e-b422-99eb13692283'
  },
  server: {
    port: port,
    routePrefix: '/api'
  }
};

