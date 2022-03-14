//Imports
const models = require("../models");
const jwtUtils = require("../utils/jwt.utils.js");
const asyncLib = require("async");

// Constants
const DISLIKED = 0;
const LIKED = 1;

// Routes

const liked = 1;
const disliked = -1;

 // LIKE, DISLIKE POST

  exports.likePost = (req, res, next) => {
    const headerAuth = req.headers["authorization"];
    const userId = jwtUtils.getUserId(headerAuth);

    const postId = req.params.postId;

    models.Post.findOne({ where: { id: postId } })
      .then((postFound) => {
        models.Like.findOne({
          where: {
            postId: postFound.id,
            userId: userId,
          },
        })
          .then((likeFound) => {
            if (!likeFound) {
              models.Like.create({
                postId: postId,
                userId: userId,
              })
                .then(() => {
                  postFound
                    .update({
                      likes: postFound.likes + liked,
                    })
                    .then(() => {
                      return res
                        .status(201)
                        .json({ message: "Message liked !", likeFound });
                    })
                    .catch((error) => {
                      res.status(400).json({ error });
                    });
                })
                .catch((error) => {
                  res.status(500).json({ message: "Message already liked !" });
                });
            } else {
              likeFound
                .destroy()
                .then(() => {
                  messageFound
                    .update({
                      likes: postFound.likes + disliked,
                    })
                    .then(() => {
                      res.status(201).json({
                        message: "I no longer like this message !",
                        likeFound,
                      });
                    })
                    .catch((error) => {
                      res.status(400).json({ error });
                    });
                })
                .catch(() => {
                  res
                    .status(500)
                    .json({ message: "Unable to dislike post !" });
                });
            }
          })
          .catch((error) => {
            res.status(404).json({ message: "Unable to find like !" });
          });
      })
      .catch((error) => {
        res.status(400).json({ message: "unable to find message !" });
      });
  }

