---
title: Node中Promise 对象的意思
date: 2023-12-21 10:56:30
categories: 前端
tags:  
     - "ES6"
     - "前端学习"
     - "Node.js"
comments: false 
---
# Node中Promise 对象的意思

Promise 对象是 JavaScript 中处理异步操作的一种方式，它代表了一个异步操作的最终完成或失败，并可以返回一个结果或错误。

## Promise 的基本概念
- Promise 是一个构造函数
  - 我们可以创建Promise的实例 const p= new Promise()
  - new 出来的一个实例对象，代表一个异步操作
- Promise.prototype上包含then() 
- .then（）方法用来预先指定成功和失败的回调函数
  - p.then(成功回调函数，失败的回调函数)
  - p.then(result=>{},error=>{})
## Promise 对象有三种状态：

1. Pending（进行中）：初始状态，表示异步操作还在进行中，既不是成功也不是失败状态。
2. Fulfilled（已完成）：表示异步操作成功完成，并返回了一个结果。
3. Rejected（已失败）：表示异步操作失败，并返回了一个错误。

Promise 对象的构造函数接受一个执行器函数作为参数，这个执行器函数有两个参数，分别是 resolve 和 reject 函数。在执行器函数中，我们可以执行异步操作，并在适当的时候调用 resolve 或 reject 函数来改变 Promise 对象的状态。

## Promise 对象具有以下特点：

1. Promise 对象是不可变的，一旦状态改变就无法再次改变。
2. Promise 对象可以通过 `.then()` 方法添加成功状态的回调函数，通过 `.catch()` 方法添加失败状态的回调函数，也可以使用 `.finally()` 方法添加无论成功或失败都会执行的回调函数。
3. Promise 对象可以通过 Promise 链实现对多个异步操作的串行或并行处理。
4. Promise 对象可以通过 `async/await` 语法进行更简洁的异步操作处理。

## 可以用console.dir(Promise) 来查课Promise对象的属性

使用 Promise 对象可以更好地处理异步操作，避免了回调地狱和层层嵌套的问题，使代码更加清晰和可维护。
`console.dir` 是 JavaScript 中的一个方法，用于将一个对象的所有可枚举属性打印到控制台中，以便查看对象的结构和属性。

该方法接受一个对象作为参数，并将对象的属性以键值对的形式打印到控制台中。与 `console.log()` 方法不同，`console.dir()` 方法会显示对象的属性的详细信息，包括属性名称、属性值和属性的数据类型。

`console.dir()` 方法在调试和开发过程中非常有用，可以帮助开发人员了解对象的结构和属性，以便更好地理解和调试代码。


```Javascript

// 利用node  fs模块进行的读取文件操作 三次嵌套容易引起回调地狱
// const { error } = require('console');
// let fs = require('fs');
// fs.readFile('./file/test1.txt','utf-8',(error,res)=>{
//     if(error) console.log(error.message)
//     console.log(res)
//     fs.readFile('./file/test2.txt','utf-8',(error,res)=>{
//         if(error) console.log(error.message)
//         console.log(res)
//         fs.readFile('./file/test3.txt','utf-8',(error,res)=>{
//             if(error) console.log(error.message)
//             console.log(res)
//         })
//     })
// })


// 利用then-fs来进行文件读取操作（未进行顺序处理）
// import thenFs from 'then-fs'
// thenFs.readFile('./file/test.txt','utf8').then((r1)=>{console.log(r1)})
// thenFs.readFile('./file/test2.txt','utf8').then((r2)=>{console.log(r2)})
// thenFs.readFile('./file/test3.txt','utf8').then((r3)=>{console.log(r3)})

// then-fs顺序处理
import thenFs from 'then-fs'
thenFs.readFile('./file/test.txt','utf8').then((r1)=>{
    console.log(r1)
    return thenFs.readFile('./file/test2.txt','utf8').then((r2)=>{
        console.log(r2)
        thenFs.readFile('./file/test3.txt','utf8').then((r3)=>{
            console.log(r3)
        })

    })
})
```