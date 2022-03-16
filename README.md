## Xây dựng RxJs và Observable (Trần Công Lực) 
### Tác giả: Trần Công Lực
### Facebook: https://www.facebook.com/congluc1902/
### Youtube: https://www.youtube.com/channel/UCZo9GHfowJ_bqdyUzZCaSig

<hr />

### Bài 01 - Giới thiệu Series, Promise vs Observable 
Giới thiệu tài liệu
Để tìm hiểu và sử dụng FrontEnd Framework JS Angular thì 
BẮT BUỘC:
- TypeScript
- **RxJs, Observable Pattern (Cực kì phức tạp)**

Mục tiêu của Docs này:
- Hiểu được cơ chế hoạt động của **Observable** và **RxJs**
- Tự xây dựng một bản **RxJs Mini** từ đầu ứng dụng **Observable**
- Cú pháp xây dựng bắt đầu từ **RxJs v5.0**

**Promise là gì?**
- Oh – ECMAScript dùng **placeholder** để mô tả Promise khá là dễ hiểu
- Như placeholder của input trong HTML nó đại diện cho 1 giá trị ở 1 nơi mà sẽ được người dùng thay thay thế.
- Thì Promise là 1 obj mô tả cho việc chúng ta tạm thời để chừa ra 1 nơi trống để sau này chứa phần data đc trả về từ 1 tác vụ bị trì hoãn (bất đồng bộ chưa trả về data ngay mà phải đợi ...)
- **Note:** Promise được thiết kế chỉ xử lí 1 tác vụ bất đồng bộ và nó sẽ trả về **1 cái giá trị (bản chất Promise thiết kế ra là vậy)**. Và nếu chúng ta muốn áp dụng vào những **mô hình trả về nhiều giá trị** thì chúng ta **KHÔNG DÙNG PROMISE** được. **=> Khái niệm Observable**

#### Example: setTimeout()
```js
function timeout(ms) {
  return new Promise((successFn, errorFn) => {
    setTimeout(() => {
      successFn('Return Data....')
      successFn('Return Data....')
      successFn('Return Data....')
    }, ms)
  })
}

timeout(2000)
  .then((data) => {
    console.log('Data: ', data)
  })
// Promise vẫn sẽ xử lí và resolve() 1 lần duy nhất

```
#### Example: setInterval()

```js
function interval(ms) {
  return new Promise((successFn, errorFn) => {
    setInterval(() => {
      successFn('Return Data....')
      successFn('Return Data....')
      successFn('Return Data....')
    }, ms)
  })
}

interval(2000)
  .then((data) => {
    console.log('Data: ', data)
  })
// Promise vẫn sẽ xử lí và resolve() 1 lần duy nhất

```
**=> Khái niệm Observable:** Nó có thể xử lí những tác vụ bất đồng bộ mà nó trả về nhiều giá trị ngắt quãng trong tương lai (Khắc phục Promise khi có những nhu cầu) – ngoài vấn đề trên thì nó còn có thể xử lí thêm nhiều thứ khác.

<hr />

### Bài 02 - Tìm hiểu Observable, Producer và Consumer
- Observable: là Object chưa hỗ trợ sẵn, người dùng sẽ phải tự định nghĩa hoặc sử dụng thư viện bên ngoài.
- Observable: là một Object đại diện cho một tập hợp nhiều giá trị, events... được gửi đến từ tương lai
- Tất cả các mô hình theo dạng Producer quản lí và gửi dữ liệu, events tới Consumer đều có thể áp dụng với Observable Pattern.
Observable sinh ra: (Những mô hình nào mà Producer là người ql phần dữ liệu và tín hiệu thì mới áp dụng được Observable)
- Để chuẩn hóa các mô hình Producer – Consumer với cùng một API giống nhau và cùng  một cơ chế xử lí
- Bù đắp thiếu sót của những mô hình đó trong Javascript. (Thiếu sót ở đây là gì? – Ex: setTimeout như phân tích nó cũng là mô hình P-C tuy nhiên lại thiếu sót khi k có handle xử lí Error)

#### Mô hình Producer – Consumer 
**Producer:** Như là người sáng tạo nội dung Youtube vậy
- Không biết người ta tạo nội dung như nào
- Không biết khi nào thì người ta đăng tải nội dung
**Consumer:** Như người coi video (Là người chủ động đăng kí để nhận dữ liệu)
- Đăng kí Chanel
- Không biết khi nào Chanle ra video mới
- Ra video rồi coi lúc nào là việc của mình
- Coi để giải trí, coi để down về edit là quyền của mình
- Hủy đăng kí Chanle tức là cái Chanel đó vẫn còn chỉ là mình k còn quan tâm và biết gì về nó

#### Example:
```js
// next() như là Consumer
// Đăng kí vào rồi lúc nào nó trả data về
// Làm gì với data là quyền của mình
const next = () => {

}
// setTimeout() như là Producer
setTimeout(next, 1000)
```

#### Example:
```js
// next() như là Consumer – nó đăng kí từ cái sự kiện của người dùng
Và khi thỏa thì Producer sẽ trả về cho nó thực hiện việc của mình.
Khi người dùng trigger đúng thì nó sẽ gửi tín hiệu đến Consumer ở đây
Là biến evt – Đm lú vcl
const next = (evt) => {}
// addEventListener() như là Producer 
// Phía engine hay webbrower
// Sẽ lắng nghe action từ user và trả về data 
// Ở đây là hành động sẽ đc xử lí trong hàm next()
document.addEventListener('click', next);
```

Do đó với các mô hình mà chúng ta áp dụng vào Observable và mình chuẩn hóa với cùng một API giống nhau thì sẽ hiện thực thêm 3 dạng:
Observable theo quy tắc thì sẽ có 3 trạng thái:
- Success – Nhận được tín hiểu coi là thành công có thể 1 hoặc nhiều lần
- Error
- Complete – Khi không muốn nhận data nữa hoặc là nhận hết được rồi. Producer không còn dữ liệu để sản sinh ra cho chúng ta tiêu thụ và xử lí nữa, hết việc ấy. 
- Ngoài ra phải có cơ chế **HỦY** k muốn nhận dữ liệu nữa. (clearTimeout hay removeEventListener) – Không nhận data nữa chứ k phải là ngăn sản sinh dữ liệu =))

**Thì tất cả các mô hình có đầy đủ yêu cầu như v thì đều có thể áp dụng vào Observable (hiện tại là biết có setTimeout, setInterVal, addEventListener rồi đó chứ chưa biết gì nhiều).**

<hr />

### Bài 03 - Observable, subscribe, next với timeout và interval 
- Next(): hiện giờ hiểu nó chỉ là 1 func – nó sẽ đc gọi khi nhận được tín hiểu của Producer gửi tới Cosumer
- Promise theo hướng Eager (gọi .timeout là nó chạy, nó kịch hoạt timer luôn r)
- Observable theo hướng Lazy (Chỉ chạy khi nào .subcribe thôi)
```js
// Promise theo hướng Eager
Promise.timeout = function(ms) {
  console.log('Kick hoat hay chua')
  return new Promise(function(resolve) {
    setTimeout(() => {
      resolve()
    }, ms);
  })
}

// Gọi Promise.timeout() đã kích hoạt liền
const promiseObj = Promise.timeout(4000)

// .then thì sau 4s
promiseObj.then(() => {
  console.log('Da Call')
})
```


<hr />

### Bài 04 - Lazy Observable với timeout
- Subcribe là methob của 1 instance cụ thể (chứ k phải là 1 object như Promise) nên muốn thêm methob cho nó (subcribe) thì phải .prototype.subcibe

```js
function Observable(subscribe) {
  this.subscribe = subscribe;
}

Observable.timeout = function(ms) {
  function timeoutWaitToRun(next) {
    setTimeout(() => {
      next()
    }, ms)
  }
  return new Observable(timeoutWaitToRun)
}

const obsTimeOut$ = Observable.timeout(3000); 

const next = () => {
    console.log('hello')
} 

obsTimeOut$.subscribe(next)

// 1. Tạo instance obs từ Obj Observable.timeout thì sẽ k kicks hoạt timer ngày
// 2. mà sẽ tạo ra 1 Obj với methob là subcribe có nhiệm vụ chạy hàm waittoRun
```

<hr />

### Bài 05 - Observable cơ bản với interval
Y hết bài trên, và đã cho thấy đc, có thể trả về nhiều giá trị bất đông bộ với 1 lần gọi hàm mà k phải nhiều độ tượng Promise như đã đề cập.

<hr />

### Bài 06 - Subscription và unsubscribe trong Observable?
- Theo quy tắc Observable thì khi gọi .subcibe thì sẽ trả về cho ta 1 obj gọi là subscription
- Subscript sẽ có 1 methob là unsubscribe (với timeout thì nó sẽ là clear timeout)

```js
function Observable(subscribe) {
  this.subscribe = subscribe
}

function Subscription(unscribe) {
  this.unscribe = unscribe
}

Observable.interval = function(ms) {
  function intervalWaitToRun(next) {
    const intervalId = setInterval(() => {
      next()
    }, ms)

    return new Subscription(() => {
      clearInterval(intervalId)
    })
  }
  // func subscibe trả về Obj subscription
  return new Observable(intervalWaitToRun)
}

const obsInterval$ = Observable.interval(500); 

// Theo quy tắc observable thì nó phải trả về 1 obj supscription
const subscription = obsInterval$.subscribe(() => {
  console.log('Interval Call');
})
subscription.unscribe() // call để xóa đăng kí

```
<hr />

### Bài 07 - Tìm hiểu về Observer
Bản chất là 1 Obj – là 1 tập hợp chứa tập hợp các Callback – các Callback này giúp chúng ta lắng nghe các giá trị được gửi tới từ Observable(tức là Producer ấy) 
**// Observer = { next, complete, error }**
Ví dụ như timeout gọi 1 lần chạy là xong hết việc, nên nó cần gọi complete, còn interval thì không.
Timeout và interval thì k có error
#### Example: Fetch
- Thì BackEnd Server là Producer – còn ứng dụng của chúng ta đang đợi data là Consumer 

<img src="./imgs/table1.jpg">

**Note:** 1 Observable bị unscribe() KHÔNG đồng nghĩa là nó complete() 

```js
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
const subs = obsTimeOut$
  .subscribe(observe)
// Nhớ chỉnh sửa đối số của hàm waitToRun nhé

```

<hr />

### Bài 08 và 09 - Hiện thực Observer or Next
- Hoàn thiện code để khi người dùng muốn truyền vào {} observe cũng đc hoặc truyền 3 đối số là 3 hàm xử lí next, error, complete đều được. (Đều được như thư viện RxJs)

```js
  // Sửa lại hàm watiToRun để kiểm tra đối số truyền vào là được
  function timeoutWaitToRun(observeOrNext, error, complete) {
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
```

Mỗi mô hình từng hàm waitRun (_subscribe) lại phải lặp lại việc kiểm tra đối số truyền vào rất là mất công.
Kĩ thuật gom nhóm logic lại: **higher order func** để xử lí chung đầu vào cho các hàm _subscribe

```js
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

```
Nên giờ mọi hàm subscribe khi gọi sẽ đc kiểm tra đầu vào rồi tiến hành xử lí logic như bình thường

<hr />

```diff
@@ Pink @@

```


