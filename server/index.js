const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./configs/key');
const { User } = require('./models/User');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB connected...'))
  .catch(e => console.log(e));
app.get('/', (req, res) => {
  res.send('Hello World!~~안녕하세요');
});
app.post('/api/users/register', (req, res) => {
  //회원 가입 할때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터베이스에 넣어준다
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});
app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다
  console.log(req);
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다',
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
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
  //요청된 이메일이 데어터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
  //비밀번호 까지 맞다면 토큰을 생성하기
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});