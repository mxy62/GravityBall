
import Matter from '../../miniprogram-1/pages/lib/matter-0.8.0.min'
import '../css/test.css';
// Matter.js module aliases
window.onload = function () {
    window.addEventListener('deviceorientation', function (event) {

        engine.world.gravity['x'] = event.gamma / 90;
        engine.world.gravity['y'] = event.beta / 180;

    }, false)
    // };
    // Matter.js module aliases
    var Engine = Matter.Engine,
        World = Matter.World,
        Body = Matter.Body,
        Bodies = Matter.Bodies,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        Composites = Matter.Composites,
        MouseConstraint = Matter.MouseConstraint;

    // create a Matter.js engine
    var engine = Engine.create(document.body, {
        render: {
            options: {
                wireframes: true,
                showAngleIndicator: true
            }
        }
    });

    // gravity init
    engine.world.gravity.x = document.getElementById("x-val").innerHTML;
    engine.world.gravity.y = document.getElementById("y-val").innerHTML;

    //add a mouse-controlled constraint
    var mouseConstraint = MouseConstraint.create(engine);
    World.add(engine.world, mouseConstraint);

    // create a load of circle bodies
    var stack = Composites.stack(250, 1, 3, 1, 0, 0, function (x, y, column, row) {
        return Bodies.circle(x, y, Common.random(25, 25), {
            friction: .001,
            restitution: .1,
            density: 100
        });
    });

    // add boundaries
    var offset = 5;
    World.add(engine.world, [
        Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, {
            isStatic: true
        }),
        Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, {
            isStatic: true
        }),
        Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, {
            isStatic: true
        }),
        Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, {
            isStatic: true
        })
    ]);

    // add all of the bodies to the world
    World.add(engine.world, stack);

    // run the engine
    Engine.run(engine);
}
