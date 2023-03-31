/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

'use strict';


function getEndpoint() {
  let endpoint = new URLSearchParams(window.location.search).get("endpoint");
  return endpoint ?? ".";
}

function attachPassword(url, password) {
  var url = new URL(url);
  if (password) {
    url.searchParams.append("key", password);
  }
  return url.toString();
}

class API {
  constructor() {
    this.password = null;
  }

  getEndpoint() {
    return getEndpoint();
  }

  async call({ method, path, body }) {
    let to = attachPassword(`${getEndpoint()}/api${path}`, this.password);
    const res = await fetch(to, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body
        ? JSON.stringify(body)
        : undefined,
    });

    if (res.status === 204) {
      return undefined;
    }

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json.error || res.statusText);
    }

    return json;
  }

  async getRelease() {
    return this.call({
      method: 'get',
      path: '/release',
    });
  }

  async getMeta() {
    return this.call({
      method: 'get',
      path: '/meta'
    });
  }

  async tryAuth() {
    return (await this.call({
      method: 'get',
      path: '/auth'
    })).success;
  }

  async deleteSession() {
    return this.call({
      method: 'delete',
      path: '/session',
    });
  }

  async getClients() {
    return this.call({
      method: 'get',
      path: '/wireguard/clients',
    });
  }

  async getStats() {
    return this.call({
      method: 'get',
      path: '/wireguard/stats',
    });
  }

}
