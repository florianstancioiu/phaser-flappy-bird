# Phaser Flappy Bird Clone

## Move the character from one side of the screen to the other - horizontally

```js
function update(time, delta) {
  if (bird.x <= 0) {
    bird.body.velocity.x = VELOCITY;
  }

  if (bird.x + bird.width >= config.width) {
    bird.body.velocity.x = -VELOCITY;
  }
}
```

## How to listen for keyboard events

```js
this.input.keyboard.on("keydown-SPACE", function () {
  console.log("pressing space button");
});
```

You put the listener in `create` function.

## How to go up against the gravity of the bird object

```js
bird.body.velocity.y = -VELOCITY;
```

Do note the **negative** velocity value that's being set on the bird object.
