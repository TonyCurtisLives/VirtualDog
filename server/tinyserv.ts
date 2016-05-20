/// <reference path="../typings/index.d.ts" />

import Http = require('http');

namespace toeknee.cors {
  export class CorsPassthru {
    private Client = require('node-rest-client').Client;
    private Promise = require('bluebird');
    private restClient = new this.Client();
    private server: Http.Server;

    // todo: pass in destination url root and url validation (for if test below)
    constructor() {
      this.initiate();
    }

    public startServer() {
      this.server.listen(8200);
      console.log('Server running at ' + this.server.localAddress + ':' + this.server.localPort);
    }

    private initiate() {
      this.server = Http.createServer((request, response) => this.passThrough(request, response));
    }

    private passThrough(request: Http.IncomingMessage, response: Http.ServerResponse) {
      console.log(request.url);
      // todo: for now only redirect the nasa stuff
      // in future make this generic
      // maybe config so we can either do JSON or other data
      if ((<string>request.url).indexOf('mars-photos') > 0) {
        this.getAsync(request.url).then(function (data) {
          response.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'X-Requested-With'
          });
          response.write(JSON.stringify(data));
          response.end();
        })
          .catch(function (err) {
            response.statusCode = 500;
            response.end();
          });
      } else {
        response.end();
      };
    }

    private getAsync(url: string) {
      return new this.Promise((resolve, reject) => {
        let args = {
          requestConfig: {
            timeout: 10000
          },
          responseConfig: {
            timeout: 10000
          }
        };
        // todo: make this more generic
        let destinationUrl = 'https://api.nasa.gov' + url;
        console.log('Destination: ' + destinationUrl);
        let returnData = '';
        let req = this.restClient.get(destinationUrl, function (data, response) {
          console.log('Destination resolved');
          resolve(data);
        });

        req.on('requestTimeout', function (req) {
          console.log('request has expired');
          req.abort();
          reject('request expired');
        });

        req.on('responseTimeout', function (res) {
          console.log('response has expired');
          reject('response expired');
        });

        req.on('error', function (err) {
          console.log('request error', err);
          reject('request error' + err);
        });
      });
    }
  }
}

new toeknee.cors.CorsPassthru().startServer();
