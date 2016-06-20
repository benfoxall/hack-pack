var Pusher = require('pusher-js')


function Hack(room, config) {

  // hard coded by envify
  this._pusher = new Pusher(process.env.p_key, {
    cluster: process.env.p_cluster,
    encrypted: true
  })

  this._socket = this._pusher.subscribe('presence-' + room, {})
  this._listeners = []

}

Hack.prototype.trigger = function(event, message) {
  this._socket.trigger('client-' + event, message)
  return this
}

Hack.prototype.on = function(event, handler) {
  this._socket.bind('client-' + event, handler)
  return this
}


module.exports = Hack
