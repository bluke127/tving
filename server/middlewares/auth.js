const { User } = require('../models/User');

let auth = (req, res, next) => {
  //인증 처리를 하는 곳

  //client cookie에서 token 가져오기
  let token = req.cookies.x_auth;

  //토큰 복호화 후 유저 검색
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
