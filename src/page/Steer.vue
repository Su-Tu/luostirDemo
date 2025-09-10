<template>
  <div id="steer">
    <div ref="myCanvas" id="myCanvas" style="border-radius: 50px"></div>
    <div id="right">
      <div id="top">
        <div style="display: flex;">
          <div>
            <img src="../assets/img/star.png" alt="" style="width: 50px">
          </div>
          <div class="msg">
            <el-rate
              v-model="value2"
              :colors="colors">
            </el-rate>
            <div class="text">推荐指数</div>
          </div>
        </div>
        <div style="display: flex;">
          <div>
            <img src="../assets/img/carNum.png" alt="" style="width: 50px">
          </div>
          <div class="msg">
            <div style="height: 20px;line-height: 20px;" class="text">
              <h1 style="margin: 0;color: #fff;font-size: 25px;">{{ $store.state.park.num }}<span style="font-size: 16px;">个</span></h1>
            </div>
            <div class="text">车位剩余</div>
          </div>
        </div>
      </div>
      <div id="bottom">
        <div ref="myCar" id="myCar"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 导入gltf加载器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// 导入解码器
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import {GUI} from "three/examples/jsm/libs/lil-gui.module.min.js"
import { PathGeometry, PathPointList } from "three.path";
import Bluearrow from "../../public/texture/bluearow.webp";
import axios from 'axios';
import { Message } from 'element-ui';
import run_algorithm from '../utils/algorithm.js'

export default {
name:'Steer',
data(){
  return {
    camera:null,
    camera1:null,

    scene:null,
    scene1:null,

    renderer:null,
    renderer1:null,

    controls:null,
    controls1:null,

    

    curve:null,
    model:null,
    pathToShow:null,
    arrow:null,

    progress:0,
    velocity:0.003,

    colors: ['#99A9BF', '#F7BA2A', '#FF9900'],

    mouse:new THREE.Vector2(),
    raycaster:new THREE.Raycaster(),
    worldPoints:[],

    world:null,
    material:null,
    cubeShape1:null,
    cubeBody1:null,
    ismoving:null,
    inputvalue:1
  }
},
computed:{
  value2(){
    return this.inputvalue % 6;
  },
},
mounted() {
  this.init()
  window.addEventListener('click', this.onMouseClick, false);
  },
beforeDestroy() {
    window.removeEventListener('click', this.onMouseClick, false);
  },
methods: {
  init(){
    this.createScene()
    this.createCamera()
    this.createRender()
    this.createLight()
    this.inModel()
    this.addSizeWatch()
    this.createControls()
    this.creatCollide()
    this.creatUI()
    this.animate()
  },
  createScene(){
    this.scene = new THREE.Scene()
    this.scene1 = new THREE.Scene()
    this.world = new CANNON.World()
    const rgbeLoader = new RGBELoader();
    rgbeLoader.load(
    "/texture/sky.hdr",
    (envmap) => {
      envmap.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.background = envmap;
      this.scene.environment = envmap;
      if(this.material){
        console.log();
        
        this.material.envMap = envmap
      }
    },
    undefined, // 进度回调
    (error) => {
      console.error("Failed to load the texture:", error); // 错误处理
    }
  );
  },
  createCamera(){
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      100000);

    // 设置相机位置和朝向
    this.camera.position.set(52, 12, 4);
    this.camera.lookAt(0, 0, 0);

    this.camera1 = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight, 
      0.1,
      1000);
      this.camera1.position.set(12,6,8);
      this.camera1.lookAt(0,0,0)
  },
  createRender(){
    const element = document.getElementById('myCanvas')
    const element1 = document.getElementById('myCar')
    this.renderer = new THREE.WebGLRenderer({ antialias: true,alpha:true});
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.setSize(element.clientWidth, element.clientHeight);
    // 设置背景色
    this.renderer.setClearColor('rgba(132, 145, 153, 0)',1.0);
    this.$refs.myCanvas.appendChild(this.renderer.domElement);

    this.renderer1 = new THREE.WebGLRenderer({ antialias: true,alpha:true})
    this.renderer1.setSize(element1.clientWidth,element1.clientHeight)
    this.renderer1.setClearColor('rgba(132, 145, 153, 0)',0);
    this.$refs.myCar.appendChild(this.renderer1.domElement);
  },
  createLight() {
    
    const dirLight = new THREE.DirectionalLight()
    dirLight.position.set(5,5,5)
    this.scene1.add(dirLight)    
    
    const ambient = new THREE.AmbientLight();
    ambient.intensity = 0.4;
    this.scene.add(ambient);
    const dirLight1 = new THREE.DirectionalLight()
    dirLight1.position.set(0, 10, 10)
    dirLight1.intensity = 0.1;
    this.scene.add(dirLight1)
    const dirLight2 = new THREE.DirectionalLight();
    dirLight2.position.set(0, 10, -10);
    dirLight2.intensity = 0.1;
    this.scene.add(dirLight2);
  },
  inModel(){
    const gltfLoader = new GLTFLoader();
    // 解码器的实例化
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('../../public/draco/gltf');
    gltfLoader.setDRACOLoader(dracoLoader);
    gltfLoader.load(
      // 模型路径
      "./model/audi.glb",
      // 加载完成回调
      (gltf)=>{
        gltf.scene.position.set(5, 0, 0);
        gltf.scene.scale.set(2, 2, 2);// 控制模型在场景中的大小
        console.log(gltf);
        gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const newMaterial = child.material.clone();
          let textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load('/texture/shen2.jpg')
          newMaterial.map = texture
          newMaterial.intensity = 0.1
          child.material = newMaterial;
        }})
        this.model1 = gltf.scene
        this.scene1.add(gltf.scene);
      }
    );
    gltfLoader.load(
      // 模型路径
      "./model/audi.glb",
      (gltf)=>{
        gltf.scene.position.set(33, 0, 0);
        gltf.scene.scale.set(0.8, 0.8, 0.8);// 控制模型在场景中的大小
        console.log(gltf.scene);
        gltf.scene.traverse((child) => {
        if (child.isMesh) {
          const newMaterial = child.material.clone();
          let textureLoader = new THREE.TextureLoader();
          const texture = textureLoader.load('/texture/shen2.jpg')
          newMaterial.map = texture
          newMaterial.intensity = 0.1
          child.material = newMaterial;
        }})
        this.model = gltf.scene
        
        this.model.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(-1, 0, 0))

        this.scene.add(gltf.scene);
      }
    )
    gltfLoader.load(
      "./model/park9.glb",
      (gltf)=>{
        gltf.scene.position.set(0,-0.001,0);
        // gltf.scene.scale.set(2,2,2);
        console.log(gltf);
        this.model1 = gltf.scene
        this.scene.add(gltf.scene)
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            if (child.name.slice(0, 2) === "平面") {
              child.position.set(0, -0.01, 0)
              const newMaterial = child.material.clone();
              newMaterial.color.set(0x84676765);
              newMaterial.side = THREE.DoubleSide
              child.material = newMaterial;
            }
            if (child.name.slice(0, 2) === '文本') {
              const newMaterial = child.material.clone()
              newMaterial.color.set(0xffffff);
              child.material = newMaterial
              // console.log(child.position); 
            }
            if (child.name.slice(0, 2) === "立方") {
              let textureLoader = new THREE.TextureLoader();
              const newMaterial = child.material.clone();
              const texture = textureLoader.load('/texture/grass.jpg')
              newMaterial.map = texture
              newMaterial.color.set(0x00ff00);
              child.material = newMaterial;
              const cubeShape2 = new CANNON.Box(new CANNON.Vec3(3.2, 4, 3.2));
              const cubeBody2 = new CANNON.Body({ mass: 0, shape: cubeShape2 });
              cubeBody2.position.copy(child.position);
              this.world.addBody(cubeBody2);
              cubeBody2.addEventListener("collide", ()=> {
                console.log("colide");
                const newMaterial = child.material.clone();
                newMaterial.color.set(0xff0000);
                child.material = newMaterial;
              });
            }
          }
        });
      }
    )
  },
  modelCurve(controlPoints){
    // 设置起点
    // const startPoint = new THREE.Vector3().copy(this.model.position)
    
    let arr=[]
    for(let i =0;i<controlPoints.length;i++){
      const x = controlPoints[i][0] * 6 - 36
      const y = controlPoints[i][1] * -6 + 36
      const point = new THREE.Vector3(x, 0.01, y)
      arr.push(point)
    }
    
    // 创建曲线
    this.curve = new THREE.CatmullRomCurve3(arr)
    this.curve.curveType = "catmullrom"
    this.curve.closed = false// 设置是否闭环
    this.curve.tension = 0.2// 
  },
  async createTexture(){
    if (this.pathToShow) {
      this.scene.remove(this.pathToShow);
      // this.pathToShow.geometry.dispose(); // 清理几何体资源
      // this.pathToShow.material.dispose(); // 清理材质资源
    }
    try{
    this.arrow = await new THREE.TextureLoader().loadAsync(Bluearrow)
    this.arrow.wrapS = THREE.RepeatWrapping;// 贴图在水平方向上允许重复
    this.arrow.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    this.material = new THREE.MeshPhongMaterial({
      map:this.arrow,//设置贴图
      reflectivity:2,
      transparent:false,// 允许透明
      depthWrite:false,// 设置深度写
      blending:THREE.AdditiveBlending
    }) 
    const up = new THREE.Vector3(0,1,0);
    let pathPoints = new PathPointList()

    // 用于设置路径点集合的属性
    pathPoints.set(this.curve.getPoints(10000),0.5,2,up,false)

    const geometry = new PathGeometry();
    geometry.update(pathPoints,{
      width:4,
      arrow:true
    })
    this.pathToShow = new THREE.Mesh(geometry,this.material)
    this.scene.add(this.pathToShow)
   }catch(err){
    console.error(err);
   }
  },
  modelMove(){
    if (this.curve == null || this.model == null || this.cubeBody1 == null) {
      // console.log('loading');
      return
    } else {
      // 确保 progress 在曲线的有效范围内进行更新。progress 在每次调用 movecar 时都会增加，如果不检查范围，可能会导致超出曲线的边界值。
      if (this.progress <= 1 - this.velocity) {
        // point表示模型当前所在的位置
        const point = this.curve.getPointAt(this.progress);
        // pointBox表示模型下一次所在的位置，因为velocity决定了模型每次更新时的进步量
        const pointBox = this.curve.getPointAt(this.progress + this.velocity);

        // 这行代码用来检查point和pointBox是否成功初始化
        if (point && pointBox) {
          // 确保模型移动到路径的当前位置上
          this.model.position.set(point.x, point.y, point.z);

          // 计算direction向量，它是从point到pointBox的方向，
          // subVectors是用来计算两个三维空间两点之间的向量，这里表示pointBox - point
          // normalize()是用来将该向量设置为单位向量，方向不变，但长度变为1
          const direction = new THREE.Vector3().subVectors(pointBox, point).normalize();
          const up = new THREE.Vector3(0, 1, 0); // Assuming the 'up' direction is along the Y-axis

          // 设置一个四元数，setFromUnitVectors(v1,v2),v1表示起始的单位向量，v2表示目标单位向量，通过这个方法可以计算出一个四元数
          // 使得如果你从 vector1 旋转到 vector2，它会应用这个四元数来进行旋转。这个四元数是最短旋转路径的四元数，即表示从 vector1 到 vector2 的最小旋转。
          // 你需要将一个物体的朝向从一个方向调整到另一个方向时，四元数提供了一种高效且准确的方式。setFromUnitVectors 方法特别适合于这种需求，因为它能够计算出所需的旋转四元数，使物体在 3D 空间中正确地对齐到目标方向。
          const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction);
          // new THREE.Vector3(0, 0, 1): 这是一个标准的单位向量，通常表示模型的前方向（在默认情况下，z 轴正方向）。
          // direction: 这是一个计算出的单位向量，表示模型当前要对准的方向。
          // 平滑旋转: 使用四元数来表示旋转而不是欧拉角可以避免旋转的突变，并且可以进行平滑的插值。四元数提供了一个高效的方式来处理复杂的旋转计算和插值，使得模型旋转更加平滑自然。
          // 避免万向节锁: 四元数避免了欧拉角在处理旋转时可能遇到的万向节锁问题，使得旋转计算更为稳定和连续。

          // model.quaternion 表示当前模型的旋转状态
          // this.model.quaternion.copy(targetQuaternion);//copy() 方法：这个方法将targetQuaternion的值拷贝到model.quaternion中，使得model的旋转状态变成targetQuaternion的旋转状态。

          // slerp（球面线性插值）方法用于在两个四元数之间进行平滑的插值。这样可以实现模型旋转的平滑过渡，而不是直接跳转到目标旋转状态。这在动画和实时图形中非常重要，因为它使得旋转变化看起来更加自然和流畅。
          this.model.quaternion.slerp(targetQuaternion, 0.15);
          // targetQuaternion 表示我想要对齐的四元数状态，0.2表示插值因子的值，插值因子的值通常介于0~1之间
          // 0.2: 介于 0 和 1 之间的值，表示旋转过渡的程度。具体来说，0.2 表示将当前旋转状态向目标旋转状态的 20% 进行插值。这意味着模型会逐渐朝向目标旋转，但不会立即完全对准。
          this.cubeBody1.position.copy(this.model.position)
          this.cubeBody1.quaternion.copy(this.model.quaternion)
        }
        this.progress += this.velocity;
      } else {
        // this.progress = 0;
        this.progress = 1
        this.ismoving = false
        this.camera.lookAt(this.model.position)
        return
      }
    }
  },
  createModel(){
    const points = this.curve.getPoints(50)// 50等分获取曲线点数组
    const geometry = new THREE.BufferGeometry().setFromPoints(points)//把顶点坐标赋值给几何体
    const materail = new THREE.LineBasicMaterial({ color: 0xffffff })
    const curveObject = new THREE.Line(geometry, materail)
    this.scene.add(curveObject)
  },
  creatCollide(){
    this.cubeShape1 = new CANNON.Box(new CANNON.Vec3(1.6, 0.8, 0.8));
    this.cubeBody1 = new CANNON.Body({ mass: 1, shape: this.cubeShape1 });
    this.world.addBody(this.cubeBody1);
    this.cubeBody1.addEventListener("collide", (e)=> {
    // console.log("Collided with:", e.body);
    // 停止汽车的运动
      this.cubeBody1.velocity.set(0, 0, 0); // 停止速度
      this.progress = 1; // 停止移动
      this.ismoving = false
      console.log(this.model.position);
      this.camera.lookAt(this.model.position)
    });
  },
  createAxesHelper(){
    // 创建世界坐标
    const axesHelper = new THREE.AxesHelper(50);
    const axesHelper1 = new THREE.AxesHelper(20);
    this.scene.add(axesHelper);
    // this.scene1.add(axesHelper1);
  },
  createControls(){
    this.clock = new THREE.Clock()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls1 = new OrbitControls(this.camera1,this.renderer1.domElement)
    this.controls.autoRotate = true
  },
  transformPoint(x, y){
    x += 39;             
    y -= 39;             
    let i = x / 6;     
    let j = -y / 6;     
    return {
      x:Math.floor(i),
      y:Math.floor(j)
    }
  },
  // 创建ui界面
  creatUI(){
    const gui = new GUI();
    const canvasContainer = this.$refs.myCanvas
    const guiElement = gui.domElement;
    canvasContainer.appendChild(guiElement)
    guiElement.style.position = 'absolute';
    guiElement.style.top = '0%'
    guiElement.style.right = "0%"
    guiElement.style.width = "150px"
    guiElement.style.backgroundColor = "rgba(0,0,0,0.3)"
    let eventObj = {
      SteerStar:()=>{
        if(this.inputvalue<=0 ||this.inputvalue > this.$store.state.park.num){
          Message({
            type:'error',
            message:'该车位不存在！'
          })
          return
        }
        if(this.$store.state.park.occupy[this.inputvalue-1]!=1){
          const point = this.transformPoint(this.model.position.x,this.model.position.z)
          console.log(point.x,point.y);
          const path = run_algorithm(point.x,point.y,this.inputvalue)
          console.log(path);
          if(path.length != 0){
            this.ismoving = true
            this.progress = 0
            this.modelCurve(path)
            this.createTexture()
          }else{
            console.dir("无路径")
          }
          // 与后端调试
          // axios({
          //   url:`http://192.168.123.130:8080/As/Astar`,
          //   method:"POST",
          //   data:{
          //     index:this.inputvalue,
          //     sx:point.x,
          //     sy:point.y,
          //   }
          // }).then(res=>{
          //   this.ismoving = true
          //   this.progress = 0
          //   this.modelCurve(res.data)
          //   this.createTexture()
          //   console.log(res);
          // }).catch(err=>{
          //   console.dir(err)
            
          // })
          // console.log(this.inputvalue);
        }else{
          Message({
            type:'error',
            message:'该车位已被占用'
          })
        }
        
      },
      FullScreen:()=>{
        this.$refs.myCanvas.requestFullscreen();
      },
      ExitScreen:()=>{
        document.exitFullscreen()
      },

    }
    gui.add(this, 'inputvalue').name('停车车位号:')
    gui.add(eventObj,"SteerStar").name('开始导航')
    gui.add(eventObj,"FullScreen").name("点击全屏")
    gui.add(eventObj,"ExitScreen").name("退出全屏")
  },
  callServer(){
    const callData = async () =>{
      try{
        axios({
          url:'http://192.168.123.130:8080/As/Check',
          method:'GET',
        }).then(res=>{
          this.$store.commit('park/p_occupy',res.data)
        }).catch(err=>{
          console.dir(err)
        })
      }
      catch(err){
        console.dir(err)
      }
    };
    const intervalId = setInterval(callData, 5000);
  },
  // 监听浏览器窗口变化来设置响应式画布
  addSizeWatch(){
    window.addEventListener('resize', () => {
      if(this.$refs.myCanvas){
      // 重置渲染器的宽高比
      this.renderer.setSize(this.$refs.myCanvas.clientWidth, this.$refs.myCanvas.clientHeight);
      // 重置相机的宽高比
      this.camera.aspect = window.innerWidth / window.innerHeight;
      // 因为相机的宽高比发生了变化，所以要重新更新一下相机的投影矩阵
      // 更新相机的投影矩阵
      this.camera.updateProjectionMatrix();
    }
    if(this.$refs.myCar){
      // 重置渲染器的宽高比
      this.renderer1.setSize(this.$refs.myCar.clientWidth, this.$refs.myCar.clientHeight);
      // 重置相机的宽高比
      this.camera1.aspect = window.innerWidth / window.innerHeight;
      // 因为相机的宽高比发生了变化，所以要重新更新一下相机的投影矩阵
      // 更新相机的投影矩阵
      this.camera1.updateProjectionMatrix();
    }
    })
  },
  start(){
    const cameraOffset = new THREE.Vector3(12, 7, -5);
    
    if (this.progress == 1 && !this.ismoving) {
      // this.camera.lookAt(this.model.position)
      this.controls.enabled = true;
      return
    }
    if (this.model && this.curve && this.pathToShow) {
      this.controls.enabled = false;
      this.controls.autoRotate = false
      if (this.arrow) {
        this.arrow.offset.x -= 0.02
      }
      this.modelMove()
      const modelDirection = this.curve.getTangent(this.progress).normalize();
      // cameraOffset.applyMatrix4(new THREE.Matrix4().lookAt(this.model.position, this.model.position.clone().add(modelDirection), new THREE.Vector3(0, 1, 0)));
      this.camera.position.copy(this.model.position).add(cameraOffset);
      this.camera.position.lerp(cameraOffset, 0.2); // 平滑插值
      this.camera.quaternion.copy(this.model.quaternion)
      this.camera.lookAt(this.model.position)
    }
  },
  // 开始渲染
  animate() {
    const delta = this.clock.getDelta() // 获取自上次调用的时间差
    // 相机更新
    // this.controls1.update()
    this.world.step(1 / 60)
    if(this.model){
      this.cubeBody1.position.copy(this.model.position)
    }
    this.controls.update()
    this.start()
    if (this.progress == 1 && !this.ismoving) {
      this.controls.enabled = true;
      this.camera.lookAt(this.model.position)
    }
    this.renderer.render(this.scene, this.camera);
    this.renderer1.render(this.scene1,this.camera1);
    requestAnimationFrame(this.animate.bind(this));
    },
  },                
}
</script>

<style scoped>
#steer{
  display: flex;
  justify-content: space-around;
}
#myCanvas{
  width: 800px !important;
  height: 600px !important;
  position: relative;
  /* border-radius: 10px !important; */
}

#right{
  width: 500px;
  height: 600px;
  padding: 40px;
  padding-left: 50px;
  padding-right: 0px;
  background-color: rgba(132, 145, 153, 0.1);
}
#top{
  display: flex;
  justify-content: space-between;
}
.msg{
  width: 150px;
  height: 50px;
}
.text{
  height: 40px;
  line-height: 40px;
  text-align: left;
  color: white;
  padding-left: 15px;
}
#myCar{
  width: 400px;
  height: 300px;
}
</style>