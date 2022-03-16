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

<hr />

### Bài 04 - Lazy Observable với timeout

<hr />

### Bài 05 - Observable cơ bản với interval

<hr />

### Bài 06 - Subscription và unsubscribe trong Observable?

<hr />

### Bài 07 - Tìm hiểu về Observer

<hr />

### Bài 08 và 09 - Hiện thực Observer or Next

<hr />

```diff
@@ Pink @@

```

<img src="./imgs/table1.jpg">
