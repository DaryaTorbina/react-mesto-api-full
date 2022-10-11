class Api {
  constructor({ address, headers }) {
    this._address = address;
    this._headers = headers;
  }

  _checkResponse(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`${res.status} ${res.statusText}`);
    }
  }
  _getHeaders() {
    const jwt = localStorage.getItem('jwt');
    return {
      Authorization : `Bearer ${jwt}`,
      ...this._headers,
    };
  }

  getUserInfo() {//
    const requestUrl = this._address + "/users/me";
    return fetch(requestUrl, {
      headers:this._getHeaders(),
    }).then(this._checkResponse);
  }

  getInitialCards() {//
    const requestUrl = this._address + "/cards";
    return fetch(requestUrl, {
      headers:this._getHeaders(),
    }).then(this._checkResponse);
  }

  updateUserInfo(body) {//
    const requestUrl = this._address + "/users/me";
    return fetch(requestUrl, {
      method: "PATCH",
      headers:this._getHeaders(),
      body: JSON.stringify(body),
    }).then(this._checkResponse);
  }

  addNewMesto(body) {//
    const requestUrl = this._address + "/cards";
    return fetch(requestUrl, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify(body),
    }).then(this._checkResponse);
  }

  removeMesto(cardID) {//
    const requestUrl = this._address + `/cards/${cardID}`;
    return fetch(requestUrl, {
      method: "DELETE",
      headers: this._getHeaders(),
    }).then(this._checkResponse);
  }
 

  changeLikeCard(id, isLiked) {//
    return fetch (`${this._address}/cards/${id}/likes`, {
      method: isLiked ? 'PUT' : 'DELETE',
      headers: this._getHeaders(),
    })
    .then(this._checkResponse)
  }

  updateProfileAvatar(body,token) {
    const requestUrl = this._address + `/users/me/avatar`;
    return fetch(requestUrl, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({avatar: body.avatar_link}),
    }).then(this._checkResponse);
  }
}
const mestoApiConfig = new Api({
  // address: "https://mesto.nomoreparties.co/v1/cohort-41",
  address: "https://mesto.front.torbinada.nomoredomains.icu",
  headers: {
    'Content-Type': 'application/json',
   // authorization: "Bearer " + localStorage.getItem("jwt")
},
});

export default mestoApiConfig;
