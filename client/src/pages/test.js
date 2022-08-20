// const a = () => setTimeout(() => console.log('a'), 0);
// const b = () => setTimeout(() => console.log('b'), 0);
// const c = async () => {
//   console.log('오잉');
//   const ef = async () => {
//     console.log('1');
//     await new Promise(resolve =>
//       setTimeout(async () => {
//         await console.log('d');
//         resolve();
//       }, 0)
//     );
//     console.log('2');
//   };
//   await ef();

//   console.log('오잉2');
// };
// const r = async () => {
//   await c();
//   console.log('ㅅㅂ');
// };
// a();
// b();
// r();
//콜백
// let a = callback => {
//   console.log(1);
//   callback();
// };
// let b = () =>
//   setTimeout(() => {
//     console.log(2);
//     c();
//   }, 1000);

// let c = () => {
//   console.log(3);
// };
// const d = () => {
//   a(b);
// };
// d();
//promise
// let a = () => {
//   console.log(1);
// };
// let b = () =>
//   new Promise(resolve =>
//     setTimeout(() => {
//       console.log(2);
//       resolve();
//       c();
//     }, 1000)
//   );

// let c = () => {
//   console.log(3);
// };
// let d = () => {
//   a();
//   b();
// };
// d();
// //async
// let a = () => {
//   console.log(1);
// };
// let b = () =>
//   new Promise(resolve =>
//     setTimeout(() => {
//       console.log(2);
//       resolve();
//     }, 1000)
//   );

// let c = () => {
//   console.log(3);
// };
// const d = async () => {
//   await a();
//   await b();
//   await c();
// };
// d();
let d = function () {
  console.log(this.name, 1);
  let b = function () {
    console.log(this.name, 2);
  };
  b();
};
let c = { name: '강', c: d };
console.log(this);
c.c();

let 라 = () => {
  console.log(this, '가');
  let 나 = () => {
    console.log(this, '나');
  };
  나();
};

let 다 = { name: '강', c: 라 };
다.c();
라();
