## 🧾 Generic Syntax for Object Spread

```js
const newObject = {
  ...existingObject,
  newKey: newValue,
};
```

- `...existingObject` copies all key-value pairs from `existingObject`
- You can add or override keys after the spread

---

## ✅ Simple Example

Let’s say you have a user object:

```js
const user = {
  name: "Harini",
  role: "Backend Developer",
};
```

Now you want to add a new field `location`:

```js
const updatedUser = {
  ...user,
  location: "Chennai",
};
```

### 🔍 Result:
```js
{
  name: "Harini",
  role: "Backend Developer",
  location: "Chennai"
}
```

If you do this:

```js
const updatedUser = {
  ...user,
  role: "Fullstack Developer",
};
```

It will **override** the `role` field.

---

## 🧠 Bonus: Spread in Arrays

```js
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]
```

---

## 🧩 Spread in Functions (Rest Parameters)

```js
function logAll(...args) {
  console.log(args); // args is an array of all arguments
}
```

---