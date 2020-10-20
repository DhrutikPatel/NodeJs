const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const cors = require('./cors');

var authenticate = require('../authenticate');

const Favorite = require('../models/favorite');

const favRouter = express.Router();

favRouter.use(bodyParser.json());

favRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({})
    .populate('user').populate('dishes')
    .then((fav) => {
        userFav = fav.filter(fav => fav.user._id.equals(req.user.id))[0]
        if(userFav){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(fav);
        }
        else{
            err = new Error('You don\'t have any dish in favorites');
            err.statusCode = 404;
            return next(err);
        }            
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.create(req.body, (err, fav) => {
        if(err) {
            err = new Error("Error in Post");
            err.statusCode = 404;
            return next(err);
        }
        else{
            fav.user = req.user;
            fav.dishes.push(req.body);
            fav.save()
            .then((fav) => {
                Favorite.findById(fav._id)
                .populate('user').populate('dishes')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res,json(dish);
                })
            }, (err) => next(err));
        }
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opreation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



favRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET opreation not supported on /favorite');
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.create(req.body, (err, fav) => {
        if (err) throw err;
        fav.user = req.user;
        fav.dishes.push(req.params.dishId);
        fav.save()
        .then((fav) => {
            Favorite.findById(fav._id)
            .populate('user').populate('dishes')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            })
        }, (err) => next(err));
    })
})
.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT opreation not supported on /favorite');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findById(req.params.dishId)
    .then((fav) => {
        if(fav != null && fav.dishes.id(req.params.dishId) != null){
            fav.dishes.id(req.params.dishId).remove();
            fav.save()
            .then((fav) => {
                Favorite.findById(fav._id)
                .populate('user').populate('dishes')
                .then((fav) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                })                
            }, err => next(err));
        }
        else{
            var err = new Error("Dish not found");
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});



module.exports = favRouter;