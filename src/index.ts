const world = "world";

export function hello(who: string = world) {
    console.log(`Hello ${who}! `);
}

hello();
