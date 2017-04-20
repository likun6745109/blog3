var settings = require('../settings');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var server = require('mongodb').Server;
module.exports = new Db(settings.db,new server(settings.host,27017),{safe:true});
//建立一个数据库Connection.DEFAULT_PORT