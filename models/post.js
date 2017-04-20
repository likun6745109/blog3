var mongodb = require('./db');
<<<<<<< 5866008ef8c4b196cf3b86d4688339bfbae211ee
var markdown = require('markdown').markdown;
=======
//var markdown = require('markdown').markdown;
>>>>>>> blog3
function Post(name,title,tags,post)
{
	this.name=name;
	this.title=title;
	this.tags = tags;
	this.post = post;
}
module.exports = Post;
Post.prototype.save = function(callback)
{
	var date = new Date();
	var time = {
		date:date,
		year:date.getFullYear(),
		month:date.getFullYear()+"-"+(date.getMonth()+1),
		day:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(),
		minute:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"-"+date.getHours()+"-"+(date.getMinutes() < 10? '0'+date.getMinutes():date.getMinutes())
	}
	var post = {
		name:this.name,
		time:time,
		title:this.title,
		tags:this.tags,
		post:this.post,
		comments:[],
		reprint_info:{},
		pv:0
	}
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err)
			}
			collection.insert(post,{safe:true},function(err){
				mongodb.close();
				if(err)
				{
					return callback(err);
				}
				callback(null);
			})
		})
	})
}
Post.getAll = function(name,callback)
{
	
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err)
			}
			var query= {};
			if(name)
			{
				query.name=name;
			}
			collection.find(query).sort({
				time:-1
			}).toArray(function(err,docs){//?????????????
				mongodb.close();
				if(err)
				{
					return callback(err)
				}
<<<<<<< 5866008ef8c4b196cf3b86d4688339bfbae211ee
				docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post);//效果是识别一些特别符号！
				})
=======
				/*docs.forEach(function(doc){
					doc.post = markdown.toHTML(doc.post);//效果是识别一些特别符号！
				})*/
>>>>>>> blog3
				callback(null,docs)
				//console.log(doc)
			})
		})
	})
}

Post.getTen = function(name,page,callback)
{
	
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err)
			}
			var query= {};
			if(name)
			{
				query.name=name;
			}
			collection.count(query,function(err,total){
				collection.find(query,{
					skip:(page-1)*10,
					limit:10
					}).sort({time:-1}).toArray(function(err,docs){
						mongodb.close()
						if(err)
						{
							return callback(err)
						}
<<<<<<< 5866008ef8c4b196cf3b86d4688339bfbae211ee
						docs.forEach(function(doc){
							doc.post = markdown.toHTML(doc.post)
						})
=======
						/*docs.forEach(function(doc){
							doc.post = markdown.toHTML(doc.post)
						})*/
>>>>>>> blog3
						callback(null,docs,total);//total为总文章数
					})
			})
		})
	})
}

Post.getOne = function(name,day,title,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			},function(err,doc){
				if(err)
				{
					mongodb.close();
					return callback(err)
				}
				if(doc)
				{
					collection.update({
						"name":name,
						"time.day":day,
						"title":title
					},{
						$inc:{"pv":1}
					},function(err,doc){
						mongodb.close();
						if(err)
						{
							return callback(err);
						}
					})
<<<<<<< 5866008ef8c4b196cf3b86d4688339bfbae211ee
					doc.post = markdown.toHTML(doc.post);
					doc.comments.forEach(function(comment,index){
						comment.content = markdown.toHTML(comment.content)
					})
=======
					/*doc.post = markdown.toHTML(doc.post);
					doc.comments.forEach(function(comment,index){
						comment.content = markdown.toHTML(comment.content)
					})*/
>>>>>>> blog3
					//console.log(doc.comments);
					callback(null,doc);
				 }
			})
		})
	})
}
Post.edit = function(name,day,title,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err);
			}
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			},function(err,doc){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				callback(null,doc);
			})
		})
	})
}
Post.update = function(name,day,title,post,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err)
			}
			collection.update({
				"name":name,
				"time.day":day,
				"title":title
			},{
				$set:{post:post}//更新post
			},function(err){
				mongodb.close()
				if(err)
				{
					callback(err)
				}
				callback(null);
			})
		})
	})
}

Post.remove = function(name,day,title,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err);
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err);
			}
			//
			collection.findOne({
				"name":name,
				"time.day":day,
				"title":title
			},function(err,doc){
				if(err)
				{
					mongodb.close()
					return callback(err)
				}
				var reprint_from="";
				if(doc.reprint_info.reprint_from)
				{
					reprint_from=doc.reprint_info.reprint_from;
				}
				if(reprint_from!="")
				{
					collection.update({
						"name":reprint_from.name,
						"time.day":reprint_from.day,
						"title":reprint_from.title
					},{
						$pull:{
							"reprint_info.reprint_to":
							{
								"name":name,
								"day":day,
								"title":title
							}
						}
					},function(err){
						if(err)
						{
							mongodb.close()
							return callback(err)
						}
					})
				}
				collection.remove({
					"name":name,
					"time.day":day,
					"title":title
				},{w:1},function(err,doc){
					mongodb.close()
					if(err)
					{
						return callback(err)
					}
					callback(null);
				})
			})
			//
			/*collection.remove({
				"name":name,
				"time.day":day,
				"title":title
			},{w:1},function(err,doc){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				callback(null);
			})*/
		})
	})
}

Post.getArchive = function(callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err)
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close();
				return callback(err)
			}
			collection.find({},{
				"name":1,
				"time":1,
				"title":1
			}).sort({time:-1}).toArray(function(err,docs){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				callback(null,docs)
			})
		})
	})
}

Post.getTags=function(callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err)
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err)
			}
			collection.distinct("tags",function(err,docs){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				//console.log(docs);//docs应该只是tag值，不是文章[ '', '555', '数字' ]

				callback(null,docs);
			})
		})
	})
}
Post.getTag=function(tag,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err)
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err)
			}
			collection.find({"tags":tag},{
				"name":1,
				"time":1,
				"title":1,
			}).sort({time:-1}).toArray(function(err,docs){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				//console.log(docs);

				callback(null,docs);
			})
		})
	})
}
Post.search = function(keyword,callback)
{
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err)
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err)
			}
			var pattern = new RegExp("^.*"+keyword+".*$","i");
			collection.find({
				"title":pattern
			},{
				"name":1,
				"time":1,
				"title":1
			}).sort({time:-1}).toArray(function(err,docs){
				mongodb.close()
				if(err)
				{
					return callback(err)
				}
				callback(null,docs);
			})
		})
	})
}
Post.reprint=function(reprint_from,reprint_to,callback){
	mongodb.open(function(err,db){
		if(err)
		{
			return callback(err)
		}
		db.collection('posts',function(err,collection){
			if(err)
			{
				mongodb.close()
				return callback(err)
			}
			collection.findOne({
				"name":reprint_from.name,
				"time.day":reprint_from.day,
				"title":reprint_from.title
			},function(err,doc){
				if(err)
				{
					mongodb.close()
					return callback(err)
				}
				var date = new Date()
				var time = {
					date:date,
					year:date.getFullYear(),
					month:date.getFullYear()+"-"+ (date.getMonth()+1),
					day:date.getFullYear()+"-"+ (date.getMonth()+1)+"-"+ date.getDate(),
					minute:date.getFullYear()+"-"+ (date.getMonth()+1)+"-"+ date.getDate()+"-"+ date.getHours()+":"+ (date.getMinutes()<10?'0'+ date.getMinutes():date.getMinutes())
				}
				
				delete doc._id;
				doc.name = reprint_to.name;
				doc.time = time;
				doc.title = (doc.title.search(/[转载]/)>-1)? doc.title:"[转载]"+doc.title;
				doc.comments = [];
				doc.reprint_info={"reprint_from":reprint_from}
				doc.pv=0;
				collection.update({
					"name":reprint_from.name,
					"time.day":reprint_from.day,
					"title":reprint_from.title
				},{
					$push:{
						"reprint_info.reprint_to":
						{
							"name":doc.name,
							"day":time.day,
							"title":doc.title
						}
					}
				},function(err){
					if(err)
					{
						mongodb.close()
						return callback(err)
					}
				})
				
				collection.insert(doc,{safe:true},function(err,post){
					mongodb.close()
					if(err)
					{
						return callback(err)
					}
					//console.log(post.ops[0])
					/*post=={ result: { ok: 1, n: 1 },
  ops:
   [ { name: 'likun6745109li',
       time: [Object],
       title: '[转载]123',
       tags: [Object],
       post: '123456789',
       comments: [],
       reprint_info: [Object],
       pv: 0,
       _id: 58e4d1ab18caf50ee3ffccf5 } ],
  insertedCount: 1,
  insertedIds: [ 58e4d1ab18caf50ee3ffccf5 ] }
*/
					callback(null,post.ops[0])//返回该篇文章post[0]==undefined
				})
				
			})
		})
	})
}
