
function Observable(_subscribe) {
  this._subscribe = _subscribe
}

function Subscription(unscribe) {
  this.unscribe = unscribe
}

Observable.prototype.subscribe = function (observeOrNext, error, complete) {
  debugger
  let observe;
  if(typeof observeOrNext == 'function') {
    observe = {
      next: observeOrNext,
      error: error || (() => {}),
      complete: complete || (() => {})
    }
  }
  else {
    observe = observeOrNext
  }

  return this._subscribe(observe)
}


Observable.timeout = function(ms) {
  function _subscribe(observe) {
    const timeoutId = setTimeout(() => {
      observe.next()
      observe.complete()
    }, ms)

    return new Subscription(() => {
      clearTimeout(timeoutId)
    })
  }
  return new Observable(_subscribe)
}


Observable.interval = function(ms) {
  function _subscribe(observe) {
    const intervalId = setInterval(() => {
      observe.next()
    }, ms)

    return new Subscription(() => {
      clearInterval(intervalId)
    })
  }
  return new Observable(_subscribe)
}

const obsTimeOut$ = Observable.timeout(2000); 
const obsInterval$ = Observable.interval(500); 


const observe = {
  next() {
    console.log('next run')
  }, 
  error() {
    
  },
  complete() {
    console.log('complete run')
  }
}

debugger
const subs1 = obsTimeOut$
  .subscribe(observe)

const subs2 = obsInterval$
  .subscribe(
    () => {
      console.log('next run')
    },
    null
  )

























// // Promise theo hướng Eager
// Promise.timeout = function(ms) {
//   console.log('Kick hoat hay chua')
//   return new Promise(function(resolve) {
//     setTimeout(() => {
//       resolve()
//     }, ms);
//   })
// }

// // Gọi Promise.timeout() đã kích hoạt liền
// const promiseObj = Promise.timeout(4000)

// // .then thì sau 4s
// promiseObj.then(() => {
//   console.log('Da Call')
// })















// // next() như là Consumer
// const next = (evt) => {}
// // addEventListener() như là Producer 
// // Phía engine hay webbrower
// // Sẽ lắng nghe action từ user và trả về data 
// // Ở đây là hành động sẽ đc xử lí trong hàm next()
// document.addEventListener('click', next);



// // next() như là Consumer
// // Đăng kí vào rồi lúc nào nó trả data về
// // Làm gì với data là quyền của mình
// // const next = () => {

// // }
// // // setTimeout() như là Producer
// // setTimeout(next, 1000)




// function interval(ms) {
//   return new Promise((successFn, errorFn) => {
//     setInterval(() => {
//       successFn('Return Data....')
//       successFn('Return Data....')
//       successFn('Return Data....')
//     }, ms)
//   })
// }

 
// interval(2000)
//   .then((data) => {
//     console.log('Data: ', data)
//   })
// // Promise vẫn sẽ xử lí và resolve() 1 lần duy nhất