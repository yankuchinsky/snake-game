import { 
  Scene, 
  PerspectiveCamera, 
  WebGLRenderer, 
  BoxGeometry, 
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  HemisphereLight,
  AxesHelper,
  GridHelper,
} from 'three';

const scene = new Scene();

const wasmModule = import("lib");

const FIELD_WIDTH = 500;
const FIELD_HEIGHT = 500;

const WIDTH = 10;
const HEIGHT = 10;


const SPEED = 10;

type Direction = 'Top' | 'Down' | 'Left' | 'Right';

const getRandomPosition = () => Math.round((Math.random() * 250) / WIDTH) * WIDTH;

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

    const camera = new PerspectiveCamera(165, window.innerWidth / window.innerHeight, 0.1, 1000);
    const hemiLight = new HemisphereLight(0xffeeb1, 0x080820, 4);
    const renderer = new WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    threeElement.appendChild(renderer.domElement);

    console.log(window.innerWidth, window.innerHeight);
    
    scene.add(hemiLight);


    const geometry = new SphereGeometry(0.6, 32, 32);
    const geometry2 = new SphereGeometry(0.6, 32, 32);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    const material2 = new MeshBasicMaterial({ color: 0x00ffff });
    const playerHead = new Mesh(geometry, material);

    const foodMesh = new Mesh(geometry2, material2);

    scene.add(playerHead, camera);
    scene.add(foodMesh, camera);


    const size = 1000;
    const divisions = 100;

    const gridHelper = new GridHelper( size, divisions );
    scene.add( gridHelper );

    const axesHelper = new AxesHelper(15);
    scene.add(axesHelper);

    camera.position.z = 5;
    camera.position.x = 0;
    camera.position.y = 10.8

    camera.rotation.x = -1.5;
    // camera.rotation.z = -0.2;

    
    // renderer.render(scene, camera);
    
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
    // foodMesh.position.set(10, 0, 20);

    // render(renderer, camera, player, playerHead);
    
    const interval = setInterval(() => {
      const point = player.get_point();
      
      if (player.self_collision_check()) {
        endGame();
      }

      if (player.collision_check(food.get_x(), food.get_y())) {
        food.set_x(getRandomPosition());
        food.set_y(getRandomPosition());
      }

      if (direction === 'Top') {
        const y = point.get_y();
        player.set_y(y - SPEED);
        // const y1 = playerHead.position.y;
        // playerHead.position.setY(y1 + SPEED);
        
      }
      
      if (direction === 'Down') {
        const y = point.get_y();
        player.set_y(y + SPEED);

        // const y1 = playerHead.position.y;
        // playerHead.position.setY(y1 + SPEED);
      }

      if (direction === 'Left') {
        const x = point.get_x();
        player.set_x(x - SPEED);
      }

      if (direction === 'Right') {
        const x = point.get_x();
        player.set_x(x + SPEED);
      }
      console.log("player", point.get_x())

      render(renderer, camera, player, playerHead, foodMesh, food);

    }, 100);


    const endGame = () => {
      clearInterval(interval);

      alert("Game over");
    }

  } catch (e) {
    console.log("ERROR ", e)
  }
}


const render = (renderer: WebGLRenderer, camera: PerspectiveCamera, player: any, playerHead: any, foodMesh: any, food: any)=> {
  const point = player.get_point();
  // context.clearRect(0, 0, 500, 500);

  // draw player
  // context.fillRect(point.get_x(), point.get_y(), WIDTH, HEIGHT);

  // const body = player.get_body();

  // body.forEach((element: any) => {
  //   context.fillRect(element.x, element.y, WIDTH, HEIGHT);
  // });

  // draw food
  // context.fillRect(food.get_x(), food.get_y(), WIDTH, HEIGHT);

  console.log(point.get_x(), point.get_y())

  playerHead.position.set(point.get_x() / 10, 1, point.get_y() / 10);
  foodMesh.position.set(food.get_x() / 10, 1, food.get_x() / 10);

  renderer.render(scene, camera);
}

bootstrap();