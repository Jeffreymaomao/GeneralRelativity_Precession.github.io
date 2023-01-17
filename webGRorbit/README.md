# General Relativty <br> Orbit near a compact body


<div style="font-size:10pt;">
author：Chang Mao Yang (楊長茂)<br>
</div>

link: <a id="start" href="https://jeffreymaomao.github.io/General_Relativity_Precession.github.io/webGRorbit/main.html">
https://jeffreymaomao.github.io/General_Relativity_Precession.github.io/webGRorbit/main.html
</a>


## User Interface
Note: need a little time to load the texture.
### Initial interface
After loadding, you should get
![](assets/16739633314896.jpg)
- Using right click + drag: you may rotate the scene
- Click the setting icon: open the setting side bar
### Setting side bar
![](assets/%E6%88%AA%E5%9C%96%202023-01-17%20%E4%B8%8B%E5%8D%889.51.26.png)
- Scroll the side bar to get more controllers

![](assets/%E6%88%AA%E5%9C%96%202023-01-17%20%E4%B8%8B%E5%8D%889.51.18.png)

## Coordinate
In glowscript, the vector in scene are be defined by following object.
#### Solar 
The solar is always fixed at origin 
$$
\vec{v}_{solar}=\left(0,0,0\right),
$$ 
```js
Spheres.Solar.pos
// return attributeVectorPos {__parent: sphere, __x: 0, __y: 0, __z: 0}
```

#### Scene center
In glowscript, center can not be change by ```setter```, but still can get the x,y,z position 
```js
Scene.center 
// return attributeVector {__parent: canvas, __x: 0, __y: 0, __z: 0}
```

#### Camera 
In glowscript, camera position
$$
\vec{v}_{pos}
$$
 has ```getter``` and ```setter```, so it can be called and defined by
```js
Scene.camera.pos = vec(1.0, 1.0, 1.0) // set value
Scene.camera.pos // get value, return vec{x: 1.0, y: 1.0, z: 1.0}
```
The camera axis also has ```getter``` and ```setter```, so can also 
```js
Scene.camera.axis = vec(-1.0, -1.0, -1.0) // set value
Scene.camera.axis // get value, return vec{x: -1.0, y: -1.0, z: -1.0}
```
#### Relation ship in graph
![](assets/16739595248355.jpg)

