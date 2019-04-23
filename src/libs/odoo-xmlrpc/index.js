/*
*
* Author: Faisal Sami
* mail: faisalsami78@gmail.com
* https://github.com/faisalsami/odoo-xmlrpc
*
*
*/
var xmlrpc = require('xmlrpc');
var url = require('url');

var Odoo = function (config) {
    config = config || {};

    var urlparts = url.parse(config.url);
    this.host = urlparts.hostname;
    this.port = config.port || urlparts.port;
    this.db = config.db;
    this.username = config.username;
    this.password = config.password;
    this.secure = true;
    this.client = null;
    if(urlparts.protocol !== 'https:') {
      this.secure = false
    }
    this.uid = null;

    this.connect = () => {
        return new Promise((resolve, reject) => {
                    var clientOptions = {
            host: this.host,
            port: this.port,
            path: '/xmlrpc/2/common'
        }   
            let client;
            if(this.secure == false) {
              client = xmlrpc.createClient(clientOptions);
            }
            else {
              client = xmlrpc.createSecureClient(clientOptions);
            }
            var params = [];
            params.push(this.db);
            params.push(this.username);
            params.push(this.password);
            params.push({});
            client.methodCall('authenticate', params, (error, value) => {
                if(error){
                  reject(error)
                }
                if(!value){
                    reject({ message: "Odoo XML RPC: Authentication failed. No UID returned from authentication." })
                }
                this.uid = value;
                resolve();
            });
        })


    };

    this.execute_kw = (model, method, params) => {
        return new Promise((resolve, reject) => {
            var clientOptions = {
                host: this.host,
                port: this.port,
                path: '/xmlrpc/2/object'
            }
            var client;
            if(this.secure == false) {
              client = xmlrpc.createClient(clientOptions);
            }
            else {
              client = xmlrpc.createSecureClient(clientOptions);
            }
            client.methodCall('execute_kw', [this.db, this.uid, this.password, model, method, params], (error, value) => {
                if(error){
                    reject(error);
                }
                resolve(value);
            });
        })
    };
    
    this.exec_workflow = (model, method, params) => {
        return new Promise((reject, resolve) => {
            var clientOptions = {
                host: this.host
                , port: this.port
                , path: '/xmlrpc/2/object'
            }
            var client;
            if(this.secure == false) {
              client = xmlrpc.createClient(clientOptions);
            }
            else {
              client = xmlrpc.createSecureClient(clientOptions);
            }
            client.methodCall('exec_workflow', [this.db, this.uid, this.password, model, method, params], (error, value) => {
                if(error){
                    reject(error);
                }
                resolve(value);
            });
        })
    };

    this.render_report = (report, params) => {
        return new Promise((resolve, reject) => {
            var clientOptions = {
                host: this.host
                , port: this.port
                , path: '/xmlrpc/2/report'
            }
            var client;
            if(this.secure == false) {
              client = xmlrpc.createClient(clientOptions);
            }
            else {
              client = xmlrpc.createSecureClient(clientOptions);
            }
            client.methodCall('render_report', [this.db, this.uid, this.password, report, params], (error, value) => {
                if(error){
                    reject(error);
                }
                resolve(value);
            });
        })
    };
};

module.exports = Odoo;
