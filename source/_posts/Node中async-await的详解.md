---
title: Node中async/await的详解
date: 2023-12-22 00:23:35
categories: 前端
tags:  
     - "ES6"
     - "前端学习"
     - "Node.js"
     - "异步操作"
---
# async/await的基本使用

async/await是ES8中引入的新语法，用于简化promise的异步操作。

使用async关键字修饰函数，表示该函数是一个异步函数。异步函数内部可以使用await关键字来等待一个promise对象的执行结果。

await关键字可以放在任何返回promise的表达式前面，它会暂停函数的执行，直到promise被解析或拒绝。如果promise被解析，await表达式会返回解析的值；如果promise被拒绝，await表达式会抛出一个错误。

异步函数可以像普通函数一样返回一个值，返回的值会被包装成一个被解析的promise对象。

以下是示例代码：

```javascript
// 异步函数示例
async function fetchData() {
  // 使用await等待promise的执行结果
  const result = await fetch('https://api.example.com/data');
  
  // 返回一个被解析的promise对象
  return result.json();
}

// 调用异步函数示例
fetchData()
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```

在上面的示例中，`fetchData`是一个异步函数，使用`await`关键字等待`fetch`函数返回的promise对象的执行结果。在`fetchData`函数内部，可以像同步代码一样使用`result`变量来访问`fetch`函数返回的结果。

调用异步函数时，可以像调用普通函数一样使用`.then`和`.catch`方法来处理异步操作的结果。在上面的示例中，使用`.then`方法来处理异步操作的成功结果，使用`.catch`方法来处理异步操作的错误结果。

通过使用async/await，我们可以将异步操作的代码写得更加简洁、易读，并且可以避免使用链式调用then的方式。
# 注意事项

## 1. 使用环境
- `async`和`await`是ES7的新特性，需要确保Node版本至少为7.6.0或更高。
- `async`函数返回一个Promise对象，可以使用`.then()`和`.catch()`进行链式调用。

## 2. 错误处理
- 使用`await`时，如果Promise被拒绝（reject），会抛出异常。因此需要使用`try...catch`语句进行错误处理。
- 如果没有正确处理错误，可能会导致程序崩溃。

## 3. 循环中使用
- 在循环中使用`await`时，需要注意可能会导致代码变成串行执行，影响性能。
- 如果需要并行执行，可以使用`Promise.all()`。

## 4. `await`的使用
- `await`只能在`async`函数内部使用。
- `await`后面跟着的应该是一个Promise对象或者任何要等待的值。
- 在async修饰的方法中，第一个await之前的代码都是同步执行的，而第一个await之后的代码都会异步执行。
## 5. 返回值
- `async`函数总是返回一个Promise，即使函数内部没有使用`await`。
- 如果`async`函数内部抛出错误，返回的Promise会被拒绝（reject）。

## 6. `await`的等待
- `await`会暂停其后的代码执行，直到Promise解决（resolve）或拒绝（reject）。

## 7. 调试
- 在使用`async`和`await`时，可能会使得调试变得更加困难，因为它们会改变错误堆栈的追踪方式。
- 