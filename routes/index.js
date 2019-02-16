'use strict';
var name_1;
var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/test';
/* GET home page. */
router.get('/', function (req, res) {
    if (req.cookies.isFirst) {
        console.log("再次欢迎访问");
        console.log(req.cookies);
    } else {
        res.cookie('isFirst', 1, { maxAge: 60 * 1000 });
        console.log("欢迎第一次访问");
    }
        var sess = req.session;
        var loginUser = sess.loginUser;
        var isLogined = !!loginUser;
        var out;
        if (isLogined) {
            out = '登出';
        }
        res.render('index', {
            isLogined: isLogined,
            name: loginUser || '登录',
            outuser:out||'注册'
        });
    
});
router.get('/hello',function (req, res) {
    res.send('The time is' + new Date().toString());
});
router.get('/user', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var out;
    if (sess === '') {
        res.send('你还没有登录！');
    }
    res.render('user', {
        name: loginUser || '登录',
        outuser: out || '注册'
    });
});
router.get('/user/:username', function (req, res) {
    res.send('user:' + req.params.username);
});
router.get('/list', function (req, res) {
    res.render('list', {
        title: 'List',
        item: [1234, 'node']
    });
});
router.get('/reg', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var out;
    res.render('reg', {

        name: loginUser || '登录',
        outuser: out || '注册'
    });
});
router.get('/listitem', function (req, res) {
    res.send('12');
});
router.get('/ex', function (req, res) {
    res.render('ex', {
        title: 'Express'
    });
});
router.get('/login', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var out;
    res.render('login', {
        name: loginUser || '登录',
        outuser: out || '注册'
    });
});
router.get('/admin', function (req, res) {
    res.render('admin', { title: 'Express' });
});
router.get('/query', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('products');

        student.find({}).toArray(function (error, docs) {
            res.send(docs);
            res.end();
            console.log(docs);
            db.close();
        });
    });
});
router.get('/insert', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');

        student.insert({

            "name": "jack",
            "password":"123456"

        }, function (error, result) {
            var re = JSON.parse(result);
            if (re.n === 2) {
                res.send("插入成功。");
            } else {
                res.send("插入失败,error：" + error);
            }
            res.end();
            db.close();
        });
    });
});
router.get('/delete', function (req, res) {
    console.log(url);
    var query = url.parse(req.url, true).query;
    var name = query.name;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('products');

        student.deleteOne({ "name": name }, function (error, result) {
            var re = JSON.parse(result);
            if (re.n === 1) {
                res.send("删除成功。");
            } else {
                res.send("删除失败,error：" + error);
            }
            res.end();
            db.close();
        });
    });
});
router.get('/update', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');

        student.updateOne({

            "name": "jack"

        }, { $set: { "name": "jack007" } }, function (error, result) {
            var re = JSON.parse(result);
            if (re.n === 1) {
                res.send("修改成功。");
            } else {
                res.send("修改失败,error：" + error);
            }
            res.end();
            db.close();
        });
    });
});
router.post('/reg', function (req, res) {
    var error;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');
        const score = 0;
//        const thumb = 0;
        console.log(req.body.username);
        if (req.body.username === '' || req.body.password === '') {
            error = '错误！';
            res.send({ data: error });
        } else {
            error='成功！';
            student.insert({
                "name": req.body.username,
                "password": req.body.password,
                "score": score
//                "thumb":thumb
            });
            res.send({ data: error });
        }
    });
    
//    req.flash('error', '注册成功！请登录！');
//    res.redirect('/reg');
});
router.post('/login', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');
        console.log(req.body.username);
        console.log(req.body.password);
        var query_doc = { name: req.body.username, password: req.body.password };
        student.count(query_doc, function (err, doc) {
            if (doc === 1) {//验证成功,转到欢迎页面
                console.log("登录成功！" + req.body.username);
                req.session.loginUser = req.body.username;
                name_1 = req.body.username;
                console.log(req.cookies);
                res.send({ data: '欢迎!' });
//                if (name_1 === 'mary') {
//                    res.redirect('/admin');
//               } else {
//                    res.redirect('/user');
//                }
            } else {
//                req.flash('error', '用户名或密码不正确！');
                var error = '用户名或密码不正确！';
                console.log('error');
                res.send({ data: error });
            }
        });
    });
});
router.get('/loginout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res.json({ ret_code: 2, ret_msg: '退出登录失败' });
            return;
        }
        res.clearCookie();
        res.redirect('/');
    });
});
router.get('/rank', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    var out;
    if (isLogined) {
        out = '登出';
    }
    var a = new Array();
    var b = new Array();
    var length;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');

        student.find({}).sort("score", -1).toArray(function (error, docs) {
            for (var i = 0; i < docs.length; i++) {
                b[i] = docs[i].name;
                a[i] = docs[i].score;
            }
            length = docs.length;
            res.render('rank', {
                'users': b,
                'scores': a,
                'len': length,
                isLogined: isLogined,
                name: loginUser || '登录',
                outuser: out || '注册'
        });
        
    });
    });
});
router.post('/comment', function (req, res) {
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('comments');
        const score = 0;
        student.insert({
            "username": req.body.username,
            "contents": req.body.comments,
            "time": req.body.time
        });
    });
    res.redirect('/comment');
});
router.get('/comment', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    var out;
    if (isLogined) {
        out = '登出';
    }
    var conman = new Array();
    var cons = new Array();
    var time = new Array();
    var thumb = new Array();
    var length;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('comments');
        student.find({}).toArray(function (error, docs) {
            for (var i = 0; i < docs.length; i++) {
                conman[i] = docs[i].username;
                cons[i] = docs[i].contents;
                time[i] = docs[i].time;
                thumb[i] = docs[i].thumb;
                console.log(conman[i]);
            }
            length = docs.length;
            console.log(length);
            res.render('comment', {
            name: loginUser || '登录',
            outuser: out || '帮助',
            users: conman,
            cons: cons,
            len: length,
            time: time,
            thumb:thumb
    });
        });
        
    });    
});
router.get('/displaycomment', function (req, res) {
    var conman = new Array();
    var cons = new Array();
    var length;
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('comments');
        student.find({}).toArray(function (error, docs) {
            for (var i = 0; i < docs.length; i++) {
                conman[i] = docs[i].username;
                cons[i] = docs[i].contents;
                console.log(conman[i]);
            }
            length = docs.length;
            res.render('displaycomment', {
                'users': conman,
                'cons': cons,
                'len':length
            });
        });
    });
});
var juge = null;
var status;
router.get('/ajax', function (req, res) {
    res.render('ajax', {
        info: juge,
        stat:status
    });
});
router.post('/ajax', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var out;
    var score_1 = new Array();
    console.log(req.body);
    console.log(req.body.flag);
    console.log(req.body.score);
    var int = parseInt(req.body.score);
    if (loginUser !== undefined) {
        if (req.body.flag === 'flag{you}') {
            juge = '正确';
            status = 1;
            MongoClient.connect(DB_CONN_STR, function (err, db) {
                const person = db.db('test');
                const student = person.collection('users');
                student.find({ 'name': loginUser }).toArray(function (error, docs) {
                    score_1[0] = docs[0].score;
                    var s = score_1[0] + int;
                    console.log(docs[0]);
                    student.updateOne({
                        "name": loginUser
                    }, { $set: { "score": s } }, function (error, result) {
                        var re = JSON.parse(result);
                        if (re.n === 1) {
                            console.log("修改成功。");
                        } else {
                            console.log("修改失败,error：" + error);
                        }
                        res.end();
                        db.close();
                    });
                });
            });

            res.redirect('/ajax');
        } else {
            juge = '错误!';
            status = 0;
            res.redirect('/ajax');
            status = 0;
        }
    } else {
        juge = '请先登录！';
        res.redirect('/ajax');
    }
});
var juge_1;
router.get('/problems', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var isLogined = !!loginUser;
    var out;
    if (isLogined) {
        out = '登出';
    }
    res.render('problems',
        {
            info: juge_1,
            stat: status,
            isLogined:isLogined,
            name: loginUser || '登录',
            outuser: out || '注册'
        });
    
});
router.post('/problems', function (req, res) {
    var sess = req.session;
    var loginUser = sess.loginUser;
    var out;
    var score_1 = new Array();
    console.log(req.body);
    console.log(req.body.flag);
    console.log(req.body.score);
    var int = parseInt(req.body.score);
    if (loginUser !== undefined) {
        if (req.body.flag === 'flag{you}') {
            juge_1 = '正确!';
            status = 1;
            MongoClient.connect(DB_CONN_STR, function (err, db) {
                const person = db.db('test');
                const student = person.collection('users');
                student.find({ 'name': loginUser }).toArray(function (error, docs) {
                    score_1[0] = docs[0].score;
                    var s = score_1[0] + int;
                    console.log(docs[0]);
                    student.updateOne({
                        "name": loginUser
                    }, { $set: { "score": s } }, function (error, result) {
                        var re = JSON.parse(result);
                        if (re.n === 1) {
                            console.log("修改成功。");
                        } else {
                            console.log("修改失败,error：" + error);
                        }
                        res.send({ data: juge_1 });
                        db.close();
                    });
                });
            });
        } else {
            juge_1 = '错误!';
            status = 0;
            res.send({ data: juge_1 });
        }
    } else {
        juge_1 = '请先登录！';
        res.send({ data: juge_1 });
    }
});
router.post('/givethumb', function (req, res) {
    var thumb = new Array();
    var int = parseInt(req.body.thumb);
    MongoClient.connect(DB_CONN_STR, function (err, db) {
        const person = db.db('test');
        const student = person.collection('users');
        student.find({ 'name': req.body.username }).toArray(function (error, docs) {
            thumb[0] = docs[0].thumb;
            var s = thumb[0] + int;
            console.log(docs[0]);
            student.updateOne({
                "name": loginUser
            }, { $set: { "thumb": s } }, function (error, result) {
                var re = JSON.parse(result);
                if (re.n === 1) {
                    console.log("修改成功。");
                } else {
                    console.log("修改失败,error：" + error);
                }
//                res.send({ data: thumb });
                db.close();
            });
        });
    });
});
module.exports = router;
