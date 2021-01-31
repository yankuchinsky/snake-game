import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BoxGeometry,
  Mesh,
  SphereGeometry,
  AxesHelper,
  GridHelper,
  TextureLoader,
  MeshPhongMaterial,
  DirectionalLight,
} from 'three';

import texture from './images/texture.png';

const txt = new TextureLoader().load(texture);

const scene = new Scene();

const wasmModule = import("lib");

const FIELD_WIDTH = 500;
const FIELD_HEIGHT = 500;

const WIDTH = 10;
const HEIGHT = 10;


const SPEED = 10;

type Direction = 'Top' | 'Down' | 'Left' | 'Right';

const getRandomPosition = () => Math.round(Math.round(Math.random() * 500 - 250) / WIDTH) * WIDTH;

const initWasm = async () => {
  try {
    const lib = await wasmModule;

    return {
      Player: lib.Player,
      Point: lib.Point,
    }
  } catch(e) {
    throw e;
  } 
}

const bootstrap = async () => {
  try {
    const rootElement = document.querySelector('body');
    const threeElement = document.querySelector('body');
    const { Player, Point } = await initWasm();
    
    if (!rootElement || !threeElement) {
      return;
    }

    const playerBody: any[] = [];

    const camera = new PerspectiveCamera(135, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeElement.appendChild(renderer.domElement);

    const dLight = new DirectionalLight( 0xffffff );
    dLight.position.set(0, 100, 0).normalize();
    scene.add(dLight);

    console.log(window.innerWidth, window.innerHeight);
    


    const geometry = new SphereGeometry(0.6, 32, 32);
    const geometry2 = new SphereGeometry(0.6, 32, 32);
    const field = new BoxGeometry(1000, 10, 1000);
    const fieldMaterial = new MeshPhongMaterial({ color: 0xb7ced6, shininess: 40, specular: 0x111111, emissive: 0x0 });
    const phongMaterial = new MeshPhongMaterial({
      color: 0xf1ff01,
      map: txt,
      shininess: 10, 
      specular: 0x111111, 
      emissive: 0x0
     });

    const playerHead = new Mesh(geometry, phongMaterial);

    const foodMesh = new Mesh(geometry2, phongMaterial);

    const fieldMech = new Mesh(field, fieldMaterial);

    fieldMech.position.x = 0;
    fieldMech.position.y = -250;

    scene.add(playerHead, camera);
    scene.add(foodMesh, camera);
    scene.add(fieldMech, camera);

    const size = 1000;
    const divisions = 100;

    const gridHelper = new GridHelper(size, divisions);
    scene.add(gridHelper);

    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    camera.position.z = 0;
    camera.position.x = 0;
    camera.position.y = 14;

    camera.rotation.x = -1.56;
    
    let direction: Direction; 

    rootElement.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        direction = 'Top';
      }

      if (event.key === 'ArrowDown') {
        direction = 'Down';
      }

      if (event.key === 'ArrowLeft') {
        direction = 'Left';
      }

      if (event.key === 'ArrowRight') {
        direction = 'Right';
      }
    })
    
    const player = Player.new(0, 0);
    playerHead.position.set(0, 0, 0);
    const food = Point.new(getRandomPosition(), getRandomPosition());
    
    const interval = setInterval(() => {
      const point = player.get_point();
      
      if (player.self_collision_check()) {
        endGame();
      }

      if (player.collision_check(food.get_x(), food.get_y())) {
        const bodyPart = new Mesh(geometry2, phongMaterial);
        scene.add(bodyPart);
        playerBody.push(bodyPart);

        food.set_x(getRandomPosition());
        food.set_y(getRandomPosition());

      }

      if (direction === 'Top') {
        const y = point.get_y();
        player.set_y(y - SPEED);
        
      }
      
      if (direction === 'Down') {
        const y = point.get_y();
        player.set_y(y + SPEED);
      }

      if (direction === 'Left') {
        const x = point.get_x();
        player.set_x(x - SPEED);
      }

      if (direction === 'Right') {
        const x = point.get_x();
        player.set_x(x + SPEED);
      }

      render(renderer, camera, player, playerHead, foodMesh, food, playerBody);

    }, 100);


    const endGame = () => {
      clearInterval(interval);

      alert("Game over");
    }

  } catch (e) {
    console.log("ERROR ", e)
  }
}


const render = (renderer: WebGLRenderer, camera: PerspectiveCamera, player: any, playerHead: any, foodMesh: any, food: any, playerBody: any[])=> {
  const point = player.get_point();
  const body = player.get_body();

  playerHead.position.set(point.get_x() / 10, 1, point.get_y() / 10);
  foodMesh.position.set(food.get_x() / 10, 1, food.get_y() / 10);

  playerBody.forEach((element: any, idx: number) => {
    if (body[idx]) {
      element.position.set(body[idx].x / 10, 1, body[idx].y / 10);
    }
  });

  renderer.render(scene, camera);
}

bootstrap();