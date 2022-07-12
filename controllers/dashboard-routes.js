const router = require('express').Router();
const {User, Player, Team} = require('../models');

router.get('/', (req, res) => {
   User.findOne({
      where:{
         id:req.session.user_id
      },
      include:[
         {
            model:Team,
            attributes:['team_name','id']
         },
         {
            model:Player,
            attributes:['player_name','position','bats','throws']
         }         
      ]
   })
   .then(dbUserData => {
      const user = dbUserData.get({plain: true});
      res.render('dashboard', {user, loggedIn: req.session.loggedIn});
   })
});

router.get('/create-team', (req, res) => {
   
   res.render('create-team', {loggedIn: req.session.loggedIn});
   
});

router.get('/edit-team/:id', (req, res) => {
   Player.findAll({
      where:{
         user_id:req.session.user_id,
         team_id:null
      },
      attributes: ['id','player_name','position','bats','throws']
   })
   .then(dbUserData => {
      const players = dbUserData.map(player => player.get({plain:true}));
      res.render('edit-team', {players, loggedIn:req.session.loggedIn});
   })
   .catch(err => {
      console.log(err);
      res.status(500).json(err);
   });
});

module.exports = router;