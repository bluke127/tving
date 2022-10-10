const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

const { auth } = require('../middlewares/auth');

//=================================
//             User
//=================================

// router.get('/auth', auth, (req, res) => {
//   res.status(200).json({
//     _id: req.user._id,
//     isAdmin: req.user.role === 0 ? false : true,
//     isAuth: true,
//     email: req.user.email,
//     name: req.user.name,
//     lastname: req.user.lastname,
//     role: req.user.role,
//     image: req.user.image,
//   });
// });

router.post('/register', (req, res) => {
  const user = new User(req.body);
  User.findOne({ user_id: req.body.user_id }, (err, user) => {
    if (user) {
      return res.json({
        success: false,
        message: '이미 존재하는 아이디',
      });
    }
  });
  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post('/login', (req, res) => {
  console.log(req.body, '로그인');
  User.findOne({ user_id: req.body.user_id }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 아이디에 해당하는 유저가 없습니다',
      });
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      console.log(isMatch, req.body.password, '이즈');
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다',
        });
      //비밀번호까지 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        console.log(user, '유저');
        if (err) return res.status(400).send(err);
        //토큰을 저장한다, 어디에? 쿠키, 로컬스터리지?
        res.cookie('x_auth', user.token).status(200).json({
          loginSuccess: true,
          id: user._id,
          name: user.name,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  console.log(req.user, 'req입니다');
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

module.exports = router;
