
# ==============================================================
# The TITLE is language in html, css and JavaScript,
# which can beautify the web. 
html =  str(open('assets/main.html', 'r').read())

from vpython import *
import numpy as np
import matplotlib.pyplot as plt
# ==============================================================
# == Useful function ===========================================
# ==============================================================
def angel_between(y1,y2):
        x1,x2 = y1[0:3], y2[0:3]
        x1 = x1/norm(x1)
        x2 = x2/norm(x2)
        angle = arccos(x1@x2)
        return angle

def norm(y):
        n = 0
        for x in y:
                n += x**2
        return sqrt(n)

def RK4(f, t, y, h):
        b1, b2, b3, b4 = 1/6, 1/3, 1/3, 1/6
        c1, c2, c3, c4 = 0, 1/2, 1/2, 1
        a21           = 1/2
        a31, a32      = 0, 1/2
        a41, a42, a43 = 0, 0, 1
        f1 = f(t + c1*h, y)
        f2 = f(t + c2*h, y + h*a21*f1)
        f3 = f(t + c3*h, y + h*a31*f1 + h*a32*f2)
        f4 = f(t + c4*h, y + h*a41*f1 + h*a42*f2 + h*a43*f3)
        Y = y + h*(b1*f1 + b2*f2 + b3*f3 + b4*f4)
        return Y

def RK4(f, t, y, h):
        b1, b2, b3, b4 = 1/6, 1/2, 1/6, 1/6
        c1, c2, c3, c4 = 0, 1/2, 1/2, 1
        a21           = 1/2
        a31, a32      = 17/36, 1/36
        a41, a42, a43 = 0, 1/2, 1/2
        f1 = f(t + c1*h, y)
        f2 = f(t + c2*h, y + h*a21*f1)
        f3 = f(t + c3*h, y + h*a31*f1 + h*a32*f2)
        f4 = f(t + c4*h, y + h*a41*f1 + h*a42*f2 + h*a43*f3)
        Y = y + h*(b1*f1 + b2*f2 + b3*f3 + b4*f4)
        return Y




def gnp2vec(array): #Transfer "general" coordinate ndarray to two vpython vectors
        vec1 = vec(array[0],array[1],array[2])
        vec2 = vec(array[3],array[4],array[5])
        return vec1, vec2

def rgb(r,g,b):
        return vec(r/255,g/255,b/255)

"""
texture from
https://www.solarsystemscope.com/textures/
"""

class textures(object):
        star = "assets/8kstar.jpg"
        starry = "assets/DeepStar.jpg"
        eagle = "assets/EagleGalaxy.jpg"
        earth0 = "assets/earth_texture.jpg"
        ceres = "assets/ceres.jpg"
        sun = "assets/Sun.jpg"
        milkyway1 = "assets/8kMilkyWay.jpg"
        milkyway2 = "assets/re8kMilkyWay.jpg"
        earth = "assets/8kEarth.jpg"
        
        solar = sun
        background = milkyway2
        planet = ceres    
        
# ==============================================================
# == parameters setting  =======================================
# ==============================================================
"""
parameters using 
https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html
"""
# (A.U.) Bulk & Orbit parametersBulk parameters
# --------------------------------------------------------------
G = 2.9593e-4   # gravitational constant (AU^3/M☉/day^2)
c = 1.7314e2    # speed of light (AU/day)
M = 1           # solar mass (M☉)
r0 = 0.3074     # Perihelion radius (AU)
v0 = 0.0340     # Perihelion velocity (AU/day)

inir0 = r0*1.0
iniM = M*1.0
iniv0 = v0*1.0

Rsolar = r0/20
Rplanet = r0/30

# ==============================================================
# == parameters setting  =======================================
# ==============================================================


def f(t,y):
        """
        r'' = GM/r^2 (1  + gamma/r^2 )
        """
        gamma = 6*r0**2*v0**2/c**2
        r = sqrt(y[0]**2+y[1]**2+y[2]**2)
        F = G*M/r**2 * (1 + gamma/r**2)
        F0 = y[3]
        F1 = y[4]
        F2 = y[5]
        F3 = F * (-y[0]/r)
        F4 = F * (-y[1]/r)
        F5 = F * (-y[2]/r)
        return np.array((F0,F1,F2,F3,F4,F5))


def print_gamma(Y):
        r = norm(Y[:3])
        print(6*r0**2*v0**2/c**2/r**2)

# ==============================================================
# intial matrix
Y0 = np.array([r0,0,0,0,v0,0]) # normal settinf
Y0 = np.array([r0,0,0,0,0,v0]) # !!! Since WebGL is (z,x,y,vz,vx,vx)!!!
Y = Y0
t = 0
dt = 0.001*((r0/inir0)**2)*((iniM/M)**1.5)      # (day)
# ==============================================================
# == Vpython ===================================================
# ==============================================================
#Vpython
scene = canvas()
scene.title = html
scene.width = 1440
scene.height = 789
scene.background = vec(1,1,1)
scene.center = vec(0,0,0)
scene.userzoom = False 
scene.lights[0].visible = False
scene.lights[1].visible = False

# --------------------------------------------------------------
# Axis
axis_length = 0.2
axis_width = 0.001
label_height = 0.015
label_width = 0.01
label_depth = 0.0035
# Axis X
axisX = arrow()
axisX.pos=vec(0,0,0)
axisX.axis = vec(1,0,0)*axis_length
axisX.shaftwidth = axis_width
axisX.color = color.red

textX = text(text="x")
textX.pos = axisX.axis
textX.height = label_height
textX.length = label_width
textX.depth = label_depth
textX.color = axisX.color

# Axis Y
axisY = arrow()
axisY.pos=vec(0,0,0)
axisY.axis = vec(0,1,0)*axis_length
axisY.shaftwidth = axis_width
axisY.color = color.green

textY = text(text="y")
textY.pos = axisY.axis
textY.height = label_height
textY.length = label_width
textY.depth = label_depth
textY.color = axisY.color


# Axis Z
axisZ = arrow()
axisZ.pos=vec(0,0,0)
axisZ.axis = vec(0,0,1)*axis_length
axisZ.shaftwidth = axis_width
axisZ.color = color.blue

textZ = text(text="z")
textZ.pos = axisZ.axis
textZ.height = label_height
textZ.length = label_width
textZ.depth = label_depth
textZ.color = axisZ.color

axisX.emissive = True
axisY.emissive = True
axisZ.emissive = True
textX.emissive = True
textY.emissive = True
textZ.emissive = True

axis = (axisX,axisY,axisZ,textX,textY,textZ)

for e in axis:
                e.visible = not e.visible
# --------------------------------------------------------------
# Universe background
Universe = sphere()
Universe.pos = vec(0,0,0)
Universe.radius = 10*r0
Universe.texture = textures.background
Universe.emissive = True
# --------------------------------------------------------------
# Solar
Solar = sphere()
Solar.pos = vec(0,0,0)
Solar.v = vec(0,0,0)
Solar.radius = Rsolar
Solar.texture = textures.solar
Solar.emissive = True
# --------------------------------------------------------------
# Solar light
SolarLight = local_light(pos=vec(0,0,0),color=rgb(255,200,30))
# --------------------------------------------------------------
# Planet
Planet = sphere(make_trail=True,
                trail_radius = Rplanet/30,
                trail_color = color.yellow)
Planet.pos = vec(Y[0],Y[1],Y[2])
Planet.radius = Rplanet
Planet.v = vec(Y[3],Y[4],Y[5])
Planet.texture = textures.planet

# --------------------------------------------------------------
# button
running = reset = end = False
def animation_run():
        global running
        running = not running
        if running: button_run.text = '<i id="pause"><i>'
        else: button_run.text = '<i id="run"><i>'
        
def animation_reset():
        global reset
        reset = not reset
        
def animation_stop():
        global end
        button_run.delete()
        button_reset.delete()
        button_stop.delete()
        end = not end
        
def controler_scroll():
        scene.userzoom = not scene.userzoom
        if scene.userzoom:
                button_scroll.text = "Scroll: no"
        else:
                button_scroll.text = "Scroll: yes"

def controler_axis():
        for e in axis:
                e.visible = not e.visible
        if e.visible:
                button_axis.text = "Axis: no"
        else:
                button_axis.text = "Axis: yes"
                
def radislider(vslider):
        global r0, inir0
        r0 = inir0 * vslider.value
        rtext.text = 'initla radius {:1.1f} r0'.format(vslider.value)
        inislider()
        
def Mslider(vslider):
        global M, iniM
        M = iniM * vslider.value
        mtext.text = 'mass of solar {:1.1f} M'.format(vslider.value)
        inislider()
        
def v0slider(vslider):
        global v0, iniv0
        v0 = iniv0 * vslider.value
        vtext.text = 'intial velocity {:1.1f} v0'.format(vslider.value)
        inislider()
        
#radius slider
vslider = slider(min=0.1, max=2.0, value=1.0, length=300, bind=radislider, right=15, pos=scene.title_anchor)
rtext = wtext(text='initla radius {:1.1f} r0'.format(vslider.value), pos=scene.title_anchor, color=color.white)
#mass slider
vslider = slider(min=1.0, max=2000000.0, value=1.0, length=300, bind=Mslider, right=15, pos=scene.title_anchor)
mtext = wtext(text='mass of solar {:1.1f} M'.format(vslider.value), pos=scene.title_anchor, color=color.white)
#velocity slider
vslider = slider(min=0.1, max=2000.0, value=1.0, length=300, bind=v0slider, right=15, pos=[5,1.001])
vtext = wtext(text='intial velocity {:1.1f} v0'.format(vslider.value), pos=scene.title_anchor, color=color.white)


button_run = button(text='<i id="run"><i>', pos=scene.title_anchor, bind=animation_run)       
button_reset = button(text='<i id="restart"><i>', pos=scene.title_anchor, bind=animation_reset)
button_stop = button(text='<i id="stop"><i>', pos=scene.title_anchor, bind=animation_stop)

button_scroll = button(text='Scroll: yes', pos=scene.title_anchor, bind=controler_scroll)
button_axis = button(text='Axis: no', pos=scene.title_anchor, bind=controler_axis)
# --------------------------------------------------------------
# Update Camera
scene.camera.pos = vec(1,1,1)*2*r0
scene.camera.axis = -scene.camera.pos

camera_pos_pre = scene.camera.pos
camera_dir_pre = scene.camera.axis

def Camera_trace(t):
        w = np.array([0.05,0.05,0.05])* 0.8
        scale = 1
        x = scale*cos(w[0]*t)
        y = scale*sin(w[1]*t)+0.5
        z = scale*sin(w[2]*t)
        return x,y,z

def Camera_update(t):
        k = 0.999
        x,y,z = Camera_trace(t)
        trace = vec(x,y,z)
        direc = -trace
        trace_now = scene.camera.pos
        direc_now = scene.camera.axis
        
        scene.camera.pos = trace - k * (trace - trace_now)
        scene.camera.axis = direc - k * (direc - direc_now)

def Camera_maneger():
        k = keysdown()
        direc = scene.camera.axis - scene.camera.pos
        left = cross(scene.camera.axis,scene.camera.up)
        # left is right
        s = 0.0001
        if not running:
                s = s*200
        if scene.camera.axis.mag >= 0.9*r0:
                if 'w' in k: scene.camera.pos += s*direc # forward
                if 's' in k: scene.camera.pos -= s*direc # backward
                if 'a' in k: scene.camera.pos -= s*left # right
                if 'd' in k: scene.camera.pos += s*left # left
        else:
              scene.camera.pos += -direc*s
              
        if center_of_camera == "Solar":
                scene.camera.axis = Solar.pos - scene.camera.pos
        elif center_of_camera == "Planet":
                scene.camera.axis = Planet.pos - scene.camera.pos

center_of_camera = "None"

def change_center():
        global center_of_camera
        if center_of_camera == "None":
                center_of_camera = "Solar"
                camera_center_menu.text = "center: Solar"
        elif center_of_camera == "Solar":
                center_of_camera = "Planet"
                camera_center_menu.text = "center: Planet"
        elif center_of_camera == "Planet":
                center_of_camera = "None"
                camera_center_menu.text = "center: None"

view_of_camera = "auto"

def change_view():
        global view_of_camera
        if view_of_camera == "auto":
                view_of_camera = "upper"
                camera_view_menu.text = "view: upper"
                scene.camera.pos = vec(0,3*r0,0)
        elif view_of_camera == "upper":
                view_of_camera = "XYplane"
                camera_view_menu.text = "view: xy plane"
                scene.camera.pos = vec(r0,0,r0)
        elif view_of_camera == "XYplane":
                view_of_camera = "auto"
                camera_view_menu.text = "view: auto"
                scene.camera.pos = vec(r0,r0,r0)
        if center_of_camera == "Planet":
                scene.camera.axis = Planet.pos - scene.camera.pos
        else:
                scene.camera.axis = Solar.pos - scene.camera.pos

# "solar","planet","none"
camera_center_menu = button(text="center: None", pos=scene.title_anchor, bind=change_center)
camera_view_menu = button(text="view: None", pos=scene.title_anchor, bind=change_view)

scene.bind('keydown', Camera_maneger)

# --------------------------------------------------------------
# iteration
def update():
        global t,Y
        #rate(1000)
        #Camera_update(t)
        Camera_maneger()

        Y = RK4(f, t, Y, dt)
        X, V = gnp2vec(Y)
        Planet.pos = X  # update position
        Planet.v = V    # redundant
        
        t = t + dt

def init():
        global t,Y,running,reset
        running = False
        reset = False
        button_run.text = '<i id="run"><i>'
        Y = np.array([r0,0,0,0,0,v0])
        X, V = gnp2vec(Y)
        Planet.pos = X
        Planet.v = V
        Planet.clear_trail()
        t = 0
        
        
def inislider():
        global t,Y,running,reset,dt
        running = False
        reset = False
        if view_of_camera == "upper":
                camera_view_menu.text = "view: upper"
                scene.camera.pos = vec(0,3*r0,0)
        elif view_of_camera == "XYplane":
                camera_view_menu.text = "view: xy plane"
                scene.camera.pos = vec(r0,0,r0)
        elif view_of_camera == "auto":
                camera_view_menu.text = "view: auto"
                scene.camera.pos = vec(r0,r0,r0)
        if center_of_camera == "Planet":
                scene.camera.axis = Planet.pos - scene.camera.pos
        else:
                scene.camera.axis = Solar.pos - scene.camera.pos
        button_run.text = '<i id="run"><i>'
        Y = np.array([r0,0,0,0,0,v0]) # !!! Since WebGL is (z,x,y,vz,vx,vx)!!!
        X, V = gnp2vec(Y)
        Planet.pos = X
        Planet.v = V
        Planet.clear_trail()
        Solar.radius = r0/20
        Planet.radius = r0/30
        Planet.trail_radius = Planet.radius/30
        Universe.radius = 10*r0
        t = 0
        dt = 0.001*(v0/iniv0)*(r0/inir0)*(iniM/M) 
        
        
# --------------------------------------------------------------
# main
while True:
        if running: update()
        if reset: init()
        if end: break
# --------------------------------------------------------------

