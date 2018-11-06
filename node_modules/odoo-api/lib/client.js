'use strict';
const request = require('./request');
const response = require('./response');

class OdooClient {

  constructor(connection, opts) {
    this._connection = connection;
    this._opts = opts;
  }

  readGroup(model, args, groupBy, params = {}) {
    if(!Array.isArray(groupBy)) {
      groupBy = [groupBy];
    }

    const body = {
      model,
      method: 'read_group',
      args: [args],
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {}),
        groupby: groupBy,
        lazy: params.lazy || true,
        offset: params.offset || 0,
        limit: params.limit || false,
        orderby: params.order || false,
        fields: params.select
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  count(model, args, params = {}) {
    const body = {
      model,
      method: 'search_count',
      args: [args],
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {})
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  search(model, args, params = {}) {
    const body = {
      model,
      method: 'search',
      args: [args],
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {})
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  read(model, args, params = {}) {
    const reqArgs = [args];

    if(params.select) {
      reqArgs.push(params.select);
    }

    const body = {
      model,
      method: 'read',
      args: reqArgs,
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {})
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  searchRead(model, args, params = {}) {
    const body = {
      model,
      method: 'search_read',
      args: [args],
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {}),
        offset: params.offset || 0,
        limit: params.limit || 5,
        order: params.order,
        fields: params.select
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  create(model, args, params = {}) {
    const body = {
      model,
      method: 'create',
      args: [args],
      kwargs: {
        context: Object.assign({}, this._connection.user_context, params.context || {})
      }
    };

    return request(this._opts, body).then(response.parse);
  }

  call(model, method, args, params = {}) {
    const body = {
      model,
      method,
      args: [args],
      kwargs: Object.assign({
        context: this._connection.user_context
      }, params)
    };

    return request(this._opts, body).then(response.parse);
  }
}

module.exports = OdooClient;
