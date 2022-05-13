function cacheDecorator<Arg, Ret>(func: (arg: Arg) => Ret): (arg: Arg) => Ret {
  const cache = new Map<Arg, Ret>();
  function decoratedFunc(this: any, arg: Arg): Ret {
    if (cache.has(arg)) {
      return cache.get(arg)!;
    }
    const cachedInstance = func.call(this, arg);
    cache.set(arg, cachedInstance);
    return cachedInstance;
  }
  return decoratedFunc;
}

type GConstructor<T = {}> = new (...args: any[]) => T;
type HasName = GConstructor<{ name: string }>;

const Scale = cacheDecorator(<TBase extends HasName>(Base: TBase) =>
  class Scaling extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }

    getName(): string {
      return this.name;
    }
  });

class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// Compose a new class from the Sprite class,
// with the Mixin Scale applier:
const EightBitSprite = Scale(Sprite);

const flappySprite = new EightBitSprite("Bird");
flappySprite.x = 15;
flappySprite.y = 30;
flappySprite.setScale(0.8);
console.log(flappySprite.getName());
console.log(flappySprite.scale);
console.log(flappySprite instanceof Scale(Sprite));
