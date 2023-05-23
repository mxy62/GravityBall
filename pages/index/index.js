const Matter = require('../lib/matter.mini')
const {
  Engine,
  Render,
  Bodies,
  World,
  MouseConstraint,
  Composites,
  Query
} = Matter
const engine = Engine.create();
const app = getApp()
let w = wx.getSystemInfoSync().windowWidth * 2 * 1.2
let h = wx.getSystemInfoSync().windowHeight * 0.9 * 2 * 1.2
Page({
  data: {
    x: 0,
    y: 0,
  },

  onReady() {

  },


  onLoad() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {
        const renderer = Render.create({
          canvas: res[0].node,
          engine: engine,
          options: {
            width: w,
            height: h,
            background: "#000000",
            wireframes: false,
          }
        });



        const createShape = function (x, y) {
          return Bodies.circle(x, y, 72, {
            frictionAir: 0.01,
            render: {
              sprite: {
                texture: "https://scdn.gongyi.qq.com/gongyi/static/homepage/sysnav-icon-flower.png",
                // yScale: 0.5,
                // xScale: 0.5,
              }
              // sprite: {
              //     texture: "https://i.ibb.co/X4tm54x/smiley.png",
              //     yScale: 0.5,
              //     xScale: 0.5,
              // }

            }
          });
        }
        // Create a wall for the shapes to bounce off
        const wallOptions = {
          isStatic: true,
          render: {
            visible: true
          }
        }
        const ground = Bodies.rectangle(w / 2, h + 50, w + 100, 100, wallOptions)
        const ceiling = Bodies.rectangle(w / 2, -50, w + 100, 100, wallOptions)
        const leftWall = Bodies.rectangle(-50, h / 2, 100, h + 100, wallOptions)
        const rightWall = Bodies.rectangle(w + 50, h / 2, 100, h + 100, wallOptions)
        const intialShapes = Composites.stack(5, 5, 2, 2, 40, 40, function (x, y) {
          return createShape(x, y)
        })

        World.add(engine.world, [
          ground,
          ceiling,
          leftWall,
          rightWall,
          intialShapes
        ]);

        Engine.run(engine);
        Render.run(renderer);

        // Add Gravity

        const _this = this
        const changeGravity = function () {

          wx.startDeviceMotionListening({
              success: function (res) {
                console.log('设备方向监听成功', res)
              },
              fail: function (res) {
                console.log('设备方向监听失败', res)
              }
            }),
            wx.onDeviceMotionChange(function (res) {
              engine.world.gravity['x'] = res.gamma / 10;
              engine.world.gravity['y'] = res.beta / 10;
              console.log('设备方向数据变化', res)
              _this.setData({
                x: res.gamma,
                y: res.beta
              })
            })

          // wx.startGyroscope({ //启动陀螺仪传感器监听功能
          //   success: function (res) {

          //     wx.onGyroscopeChange(function (res) { //监听陀螺仪传感器

          //       engine.world.gravity.x = res.y*2;
          //       engine.world.gravity.y = res.x*2;
          //       _this.setData({
          //         x:res.x,
          //         y:res.y
          //       })
          //     })
          //   }
          // })
          // requestAnimationFrame(changeGravity)
        }

        changeGravity()
      })
  },

})