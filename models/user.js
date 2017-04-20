var mongodb = require('./db');
function User(user)
{
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
}
module.exports = User;
User.prototype.save = function(callback)
{
	var user = {
		name:this.name,
		password:this.password,
		email:this.email
	}
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}
			collection.insert(user,{safa:true},function(err,user){
				mongodb.close();
				if(err)
				{
					return callback(err)
				}
				//console.log(user);
				/*{ result: { ok: 1, n: 1 },
					ops:
					 [ { name: '588',
						 password: '55',
						 email: '87@11',
						 _id: 58d60dadc5953ecf31d40a66 } ],
					insertedCount: 1,
					insertedIds: [ 58d60dadc5953ecf31d40a66 ] }
*/
				callback(null,user.ops[0]);
			})
		})
	})
}
User.get = function(name,callback){
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('users',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				name:name
			},function(err,user){
				mongodb.close();
				if(err)
				{
					callback(err);
				}
				//console.log(user);user=null
				callback(null,user)
			})
		})
	})
}