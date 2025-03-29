---
id: 1025
slug: typescript-tutorial
title: TypeScript基础教程：初学者友好教程
authors: [bianliang]
tags: [TypeScript, JavaScript, 前端开发]
keywords: [TypeScript教程, TS入门, TypeScript基础, TypeScript高级特性, TS类型系统, 接口, 泛型, 装饰器]
description: 全面讲解TypeScript开发技术，从环境搭建、基础语法到高级特性，帮助前端和Node.js开发者提升代码质量和开发效率
image: https://bianliangrensheng.cn/gImage/title/typescript-tutorial.png
date: 2025-03-29
---

# TypeScript 教程

在当今前端开发领域，TypeScript已经成为提升代码质量和开发效率的必备技能。本教程专为TypeScript新手打造，从最基础的环境搭建开始，循序渐进地讲解类型系统、接口、泛型等核心概念，同时配合丰富的代码示例帮助你快速掌握。无论你是想提升代码健壮性的JavaScript开发者，还是准备学习Angular、Vue3或React的前端新人，这份完整指南都将帮助你建立坚实的TypeScript基础，避开常见陷阱，让你的开发之路更加顺畅。

<!-- truncate -->
## 一、TypeScript 介绍

TypeScript 简称『TS』，是微软开发的一个开源的编程语言。它是 JavaScript 的**超集**，为 JS 添加了**静态类型定义**功能。TypeScript 不仅支持 ES6、ES7 等规范，而且通过类型系统提供了更强大的工具支持，极大地提高了开发效率和代码质量。


## 二、TS 特点

TS 主要有如下几个特点:

* 🔄 **完全兼容 JavaScript**：是 JavaScript 的超集，任何现有的 JS 程序都是合法的 TS 程序
* 🛡️ **引入类型系统**：可以尽早的定位错误位置, 帮助提升开发效率，增强代码可靠性
* ⚡ **先进的 JavaScript**：支持 JavaScript 的最新特性，提前使用 ECMAScript 的新特性
* 🔧 **强大的工具支持**：智能提示、代码补全、重构等 IDE 功能更加强大
* 🏢 **企业级应用**：适用于大型项目，有助于团队协作和代码维护

> 💡 **为什么选择TS**：TypeScript 在社区的流行度越来越高，它非常适用于一些大型项目，也非常适用于一些基础库，极大地帮助我们提升了开发效率和体验。Angular、Vue3、React 等主流框架都采用了 TypeScript 构建。

## 三、TS 环境搭建

学习 TS 阶段我们可以借助 TypeScript 的编译工具『typescript』

```shell
npm i -g typescript
```

使用下面的命令检查是否安装成功以及查看包的版本

```
tsc -v
```

## 四、TS 初体验

1. typescript 初始化.  创建 ts 的配置文件`tsconfig.json`

   ```
   tsc --init
   ```

2. 创建一个 JS 文件 『hello.ts』

   ```typescript
   let str: string = 'hello world';
   console.log(str);
   
   function add(a: number, b:number):number{
     return a + b;
   }
   console.log(add(1, 100));
   ```

3. 命令行运行，`这里的后缀是 ts`

   ```sh
   tsc hello.ts
   ```

4. 命令行运行，`这里的后缀是 js`

   ```shell
   node hello.js
   ```

   > 🔍 **提示**：可以使用 `tsc -w` 命令开启自动编译

## 五、TS 语法

### 5.1 TS 基础类型

TypeScript 支持与 JavaScript 几乎相同的数据类型，此外还提供了实用的枚举类型方便我们使用

TS 支持的变量类型如下：

| 类型       | 描述                                                    |
| ---------- | ------------------------------------------------------- |
| boolean    | 限制为布尔类型， true 或者 false                        |
| number     | 限制为任意的数字。 二进制，八进制，十进制，十六进制均可 |
| string     | 限制为任意的字符串。单引号，双引号，反引号均可          |
| 字面量     | 限制为某个字面量                                        |
| any        | 限制为任意类型                                          |
| unknown    | 类型安全的any                                           |
| void       | 限制为 undefined, 一般用来限制函数的返回值              |
| never      | 表示永不可能有返回值的类型                              |
| object     | 限制为对象类型                                          |
| array      | 限制为数组类型    string[]   Array&lt;number&gt;        |
| tuple 元组 | 限制为固定长度与类型的数组                              |
| enum 枚举  | 限制为枚举的数据                                        |

#### 5.1.1 布尔类型

最基本的数据类型就是简单的 true/false 值，在JavaScript 和 TypeScript 里叫做 `boolean`（其它语言中也一样）。

```typescript
let isDone: boolean = false;
isDone = true;
// isDone = 2 // error
```

#### 5.1.2 数字类型

除了支持十进制和十六进制字面量，也支持二进制和八进制字面量。

```typescript
let a1: number = 10 // 十进制
let a2: number = 0b1010  // 二进制
let a3: number = 0o12 // 八进制
let a4: number = 0xa // 十六进制
```

#### 5.1.3 字符串类型

JavaScript 程序的另一项基本操作是处理网页或服务器端的文本数据。 像其它语言里一样，我们使用 `string` 表示文本数据类型。 和 JavaScript 一样，可以使用双引号（`"`）或单引号（`'`）表示字符串。

```typescript
let name:string = 'tom'
name = 'jack'
// name = 12 // error
let age:number = 12
const info = `My name is ${name}, I am ${age} years old!`
```

#### 5.1.4 字面量类型

TS 允许限制某个变量为固定的某个值

```typescript
let z: 521 = 521;
let z2: 'love' = 'love';
// z='abc'; //类型不符 error

// 联合类型
let gender: '男' | '女';
gender = '男';
gender = '女';
// gender = '未知'; // error
```

#### 5.1.5 any 类型

any 类型允许变量的值为任意类型, 并且可以进行任意类型的赋值

```typescript
let a: any = 100;
a = 'iloveyou';
a = true;
a = [1, 2, 3];

// 隐式any，声明变量不指定类型且不初始化
let something;
something = 100;
something = '你好';
```

> 尽量不要用 any, 因为对于 any 类型 typeScript 会关闭类型检查功能

#### 5.1.6 unknown 类型

`unknown` 是 TypeScript 3.0 引入的新类型，它是 `any` 类型对应的安全类型。

```typescript
let notSure: unknown = 4;
notSure = "hello";
notSure = [];

// unknown比any更安全 - 不能直接赋值给其他类型
let s: string;
// s = notSure; // 错误：不能将类型"unknown"分配给类型"string"

// 需要先进行类型检查或类型断言
if (typeof notSure === "string") {
  s = notSure; // 正确：经过类型检查
}

// 类型断言
s = notSure as string; // 或 s = <string>notSure;
```

#### 5.1.7 void 类型

void 表示空的, 该类型主要用在函数返回值上

```typescript
function fn():void{
  console.log("没有返回值");
  // return 123; // 错误
}

// void类型变量只能赋值undefined或null（在strictNullChecks关闭时）
let unusable: void = undefined;
```

#### 5.1.8 never 类型

表示永不存在的值的类型，常用于：
- 总是会抛出异常的函数
- 无法正常结束的函数（如死循环）

```typescript
// 抛出错误的函数
function error(message: string): never {
  throw new Error(message);
}

// 无限循环的函数
function infiniteLoop(): never {
  while (true) {}
}
```

#### 5.1.9 对象类型

object 限制类型为对象，但使用更具体的类型更有帮助

```typescript
// 基本object类型
let o: object = {};
o = [];
o = new Date();
// o = 123; // 错误

// 对象字面量类型
let person: { name: string; age: number } = {
  name: "张三",
  age: 30
};

// 可选属性
let user: { id: number; email?: string } = {
  id: 1
};
```

#### 5.1.10 数组类型

TypeScript 像 JavaScript 一样可以操作数组元素。数组类型有两种表示方式：

```typescript
// 方式1: 类型[]
let list1: number[] = [1, 2, 3];

// 方式2: Array<类型>
let list2: Array<string> = ['a', 'b', 'c'];

// 多类型数组
let list3: (number | string)[] = [1, 'a', 2, 'b'];

// 只读数组
let readonlyArr: ReadonlyArray<number> = [1, 2, 3];
// readonlyArr[0] = 5; // 错误：只读数组不能修改
```

#### 5.1.11 元组类型

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```typescript
// 声明一个元组类型
let tuple: [string, number];

// 赋值必须按照类型顺序
tuple = ['hello', 10]; // 正确
// tuple = [10, 'hello']; // 错误：类型不匹配

// 访问元素
console.log(tuple[0].substring(1)); // 'ello'
// console.log(tuple[1].substring(1)); // 错误：number类型没有substring方法

// 可选元素
let tupleWithOptional: [string, number?] = ['hello'];
```

#### 5.1.12 枚举类型

`enum` 类型是对JavaScript标准数据类型的一个补充，使用枚举可以定义一些有名字的数值常量。

```typescript
// 数字枚举：默认从0开始
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right  // 3
}

// 可以手动设置枚举值
enum StatusCode {
  OK = 200,
  NotFound = 404,
  Error = 500
}

// 字符串枚举
enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

// 使用枚举
let dir: Direction = Direction.Up;
console.log(dir); // 0
console.log(Direction[0]); // "Up"
```

### 5.2 类型断言与联合类型

#### 5.2.1 类型断言

类型断言可以用来明确告诉编译器变量的类型，有两种语法形式：

```typescript
// 语法1: <类型>变量
let someValue: unknown = "this is a string";
let strLength: number = (<string>someValue).length;

// 语法2: 变量 as 类型 (推荐，在JSX中只能使用这种)
let someValue2: unknown = "this is a string";
let strLength2: number = (someValue2 as string).length;

// 类型断言不是类型转换
let n = 123;
// let s = n as string; // 错误：number不能断言为string

// 可以先断言为unknown，再断言为目标类型
let s = (n as unknown) as string;
```

#### 5.2.2 联合类型

联合类型表示一个值可以是几种类型之一：

```typescript
// 联合类型
let num: number | string;
num = 123;
num = "abc";
// num = true; // 错误

// 使用类型守卫来处理联合类型
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  } 
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error("Expected string or number");
}
```

### 5.3 接口与类型别名

#### 5.3.1 接口

接口是 TypeScript 的一个核心概念，用于定义对象的类型：

```typescript
// 基本接口定义
interface Person {
  name: string;
  age: number;
}

// 使用接口
let user: Person = {
  name: "小明",
  age: 20
};

// 可选属性
interface Config {
  color?: string;
  width?: number;
}

// 只读属性
interface Point {
  readonly x: number;
  readonly y: number;
}

// 函数类型接口
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc = function(src, sub) {
  return src.search(sub) > -1;
};

// 索引类型
interface StringArray {
  [index: number]: string;
}

let myArray: StringArray = ["Bob", "Fred"];
```

#### 5.3.2 类型别名

类型别名用来给一个类型起个新名字：

```typescript
// 基本类型别名
type Name = string;
type Age = number;
type User = { name: Name; age: Age };

// 联合类型别名
type WindowStates = "open" | "closed" | "minimized";
type StringOrNumber = string | number;

// 函数类型别名
type GreetFunction = (name: string) => string;

// 接口vs类型别名
// 接口可以被继承和实现，类型别名不能
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// 类型别名可以用于原始类型、联合类型、元组等
type Coordinate = [number, number];
type Callback = (...args: any[]) => void;
```

### 5.4 函数

#### 5.4.1 函数类型

TypeScript 可以为函数的参数和返回值指定类型：

```typescript
// 函数声明
function add(x: number, y: number): number {
  return x + y;
}

// 函数表达式
let myAdd: (x: number, y: number) => number = 
    function(x: number, y: number): number { return x + y; };

// 可选参数
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + " " + lastName;
  return firstName;
}

// 默认参数
function greeting(name: string = "World"): string {
  return `Hello, ${name}!`;
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0);
}
```

#### 5.4.2 函数重载

TypeScript 允许声明函数重载，以表示函数可以用不同的参数类型调用：

```typescript
// 重载签名
function padding(all: number): { top: number; right: number; bottom: number; left: number };
function padding(topBottom: number, leftRight: number): { top: number; right: number; bottom: number; left: number };
function padding(top: number, right: number, bottom: number, left: number): { top: number; right: number; bottom: number; left: number };

// 实现签名
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```

### 5.5 类

TypeScript 支持基于类的面向对象编程，增加了类型检查和一些扩展：

```typescript
// 基本类声明
class Person {
  // 属性
  name: string;
  
  // 构造函数
  constructor(name: string) {
    this.name = name;
  }
  
  // 方法
  sayHello(): void {
    console.log(`Hello, my name is ${this.name}`);
  }
}

// 继承
class Employee extends Person {
  department: string;
  
  constructor(name: string, department: string) {
    super(name); // 调用父类构造函数
    this.department = department;
  }
  
  // 重写方法
  sayHello(): void {
    super.sayHello(); // 调用父类方法
    console.log(`I work in ${this.department}`);
  }
}

// 访问修饰符
class Animal {
  private name: string; // 私有，只在类内可访问
  protected age: number; // 受保护，在类内和子类可访问
  public type: string; // 公开，默认
  
  // 静态属性
  static categories: string[] = ["mammal", "bird", "fish"];
  
  // 只读属性
  readonly id: number;
  
  constructor(name: string, age: number, type: string) {
    this.name = name;
    this.age = age;
    this.type = type;
    this.id = Math.random() * 1000;
  }
}

// 参数属性(简写)
class User {
  constructor(
    public username: string,
    private password: string,
    readonly createdAt: Date = new Date()
  ) {}
}
```

### 5.6 泛型

泛型允许创建可重用的组件，支持多种类型：

```typescript
// 基本泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 调用泛型函数
let result = identity<string>("hello");
let result2 = identity(42); // 类型推断

// 泛型接口
interface GenericIdentityFn<T> {
  (arg: T): T;
}

// 泛型类
class GenericNumber<T> {
  zeroValue: T;
  add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };

// 泛型约束
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);  // 通过约束，可以确保T有length属性
  return arg;
}

// 多个类型参数
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}
```

### 5.7 高级类型

#### 5.7.1 交叉类型

交叉类型是将多个类型合并为一个类型：

```typescript
// 交叉类型
type Employee = Person & { employeeId: number };

// 实际使用
interface BusinessPartner {
  name: string;
  credit: number;
}

interface Identity {
  id: number;
  email: string;
}

type Customer = BusinessPartner & Identity;

// 使用交叉类型
let customer: Customer = {
  name: "张三",
  credit: 100,
  id: 123,
  email: "zhangsan@example.com"
};
```

#### 5.7.2 条件类型

条件类型根据类型关系进行选择：

```typescript
// 基本条件类型
type IsString<T> = T extends string ? true : false;

// 实际应用
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

type EmailMessage = MessageOf<Email>; // string

// 内置条件类型
// Extract: 提取T中可以赋值给U的类型
type StringOrNumber = string | number | boolean;
type ExtractedType = Extract<StringOrNumber, string | number>; // string | number

// Exclude: 从T中排除可以赋值给U的类型
type ExcludedType = Exclude<StringOrNumber, boolean>; // string | number

// NonNullable: 从T中排除null和undefined
type NonNullableType = NonNullable<string | null | undefined>; // string
```

#### 5.7.3 映射类型

映射类型可以基于旧类型创建新类型：

```typescript
// 基本映射类型
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
};

type Partial<T> = {
  [K in keyof T]?: T[K]
};

// 实际应用
interface Person {
  name: string;
  age: number;
}

type ReadonlyPerson = Readonly<Person>;
type PartialPerson = Partial<Person>;

// 具体实例
const readonlyPerson: ReadonlyPerson = {
  name: "李四",
  age: 30
};
// readonlyPerson.name = "王五"; // 错误：只读属性

// 自定义映射类型
type Nullable<T> = {
  [K in keyof T]: T[K] | null
};

type NullablePerson = Nullable<Person>;
```

### 5.8 装饰器

装饰器是一种特殊类型的声明，可以被附加到类、方法、访问符、属性或参数上：

```typescript
// 需要在tsconfig.json中启用 "experimentalDecorators": true

// 类装饰器
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }
  greet() {
    return "Hello, " + this.greeting;
  }
}

// 方法装饰器
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Example {
  @enumerable(false)
  method() {}
}

// 属性装饰器
function format(formatString: string) {
  return function (target: any, propertyKey: string) {
    let value: string;
    
    const getter = function() {
      return value;
    };
    
    const setter = function(newVal: string) {
      value = formatString.replace("%s", newVal);
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}

class Greeting {
  @format("Hello, %s")
  name: string;
}
```

## 六、TS 与 JavaScript 项目实战

### 6.1 配置文件详解

TypeScript 使用 `tsconfig.json` 文件来配置编译选项：

```json
{
  "compilerOptions": {
    // 基本选项
    "target": "es2016",            // 指定ECMAScript目标版本
    "module": "commonjs",          // 指定模块代码生成
    "lib": ["dom", "es2016"],      // 指定要包含的库文件
    "outDir": "./dist",            // 输出目录
    "rootDir": "./src",            // 源码目录
    
    // 严格类型检查选项
    "strict": true,                // 启用所有严格类型检查选项
    "noImplicitAny": true,         // 在表达式和声明上有隐含的any类型时报错
    "strictNullChecks": true,      // 启用严格的null检查
    
    // 额外检查
    "noUnusedLocals": true,        // 有未使用的变量时报错
    "noUnusedParameters": true,    // 有未使用的参数时报错
    
    // 模块解析选项
    "esModuleInterop": true,       // 启用esModuleInterop以允许导入commonjs模块
    "resolveJsonModule": true,     // 允许导入json模块

    // 高级选项
    "skipLibCheck": true,          // 跳过对声明文件的类型检查
    "forceConsistentCasingInFileNames": true // 禁止对同一个文件的不一致的引用
  },
  "include": ["src/**/*"],         // 包含的文件
  "exclude": ["node_modules", "**/*.spec.ts"] // 排除的文件
}
```

### 6.2 TypeScript项目实战技巧

#### 6.2.1 声明文件

为JavaScript库创建TypeScript声明文件：

```typescript
// 例如为jQuery创建声明文件 jquery.d.ts
declare namespace $ {
  function ajax(settings: any): void;
  function get(url: string, callback: (data: any) => void): void;
  
  interface JQuery {
    text(content: string): JQuery;
    on(event: string, handler: (event: any) => void): JQuery;
  }
  
  function (selector: string): JQuery;
}

// 使用声明文件
$("#button").on("click", function() {
  $.ajax({url: "/api/data"});
});
```

#### 6.2.2 命名空间和模块

组织代码的方式：

```typescript
// 命名空间
namespace Validation {
  export interface StringValidator {
    isValid(s: string): boolean;
  }
  
  export class LettersOnlyValidator implements StringValidator {
    isValid(s: string): boolean {
      return /^[A-Za-z]+$/.test(s);
    }
  }
}

// 使用命名空间
let validator = new Validation.LettersOnlyValidator();

// ES模块
// math.ts
export function add(x: number, y: number): number {
  return x + y;
}

// main.ts
import { add } from "./math";
console.log(add(1, 2));
```

## 七、总结与学习资源

### 7.1 核心概念总结

- ✅ **TypeScript = JavaScript + 类型系统**
- 🔍 **类型系统帮助开发者提前发现错误**
- 📝 **接口和类型别名用于定义复杂类型**
- 🔄 **泛型提供类型复用能力**
- 🏗️ **类和装饰器支持面向对象编程**

### 7.2 学习资源推荐

- 📚 官方文档：[TypeScript官方文档](https://www.typescriptlang.org/docs/)
- 🎮 在线练习：[TypeScript Playground](https://www.typescriptlang.org/play)
- 📖 书籍推荐：《深入理解TypeScript》
- 💻 开源项目：学习 TypeScript 的最佳方式是阅读优秀的开源项目代码

> **🌟 学习建议**：TypeScript是现代前端开发的必备技能，掌握它将大大提高你的开发效率和代码质量。从基础类型开始，逐步掌握接口、泛型和高级类型，最后通过实际项目巩固所学知识。希望这篇教程能帮助你入门并不断进步！



