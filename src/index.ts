const wasmModule = import("lib");

const WIDTH = 10;
const HEIGHT = 10;

type Direction = 'Top' | 'Down' | 'Left' | 'Right';

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
    const { Player, Point } = await initWasm();
    
    if (!rootElement) {
      return;
    }

    const context = initCanvas();

    if (!context) {
      return;
    }
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
    
    const player = Player.new(250, 250);
    const food = Point.new(120, 120);

    render(context, player, food);
    
    const interval = setInterval(() => {
      const point = player.get_point();
      
      player.collision_check(food.get_x(), food.get_y());

      if (direction === 'Top') {
        const y = point.get_y();
        player.set_y(y - 10);
      }
      
      if (direction === 'Down') {
        const y = point.get_y();
        player.set_y(y + 10);
      }

      if (direction === 'Left') {
        const x = point.get_x();
        player.set_x(x - 10);
      }

      if (direction === 'Right') {
        const x = point.get_x();
        player.set_x(x + 10);
      }

      render(context, player, food);

    }, 100);


  } catch (e) {
    console.log("ERROR ", e)
  }
}


const initCanvas = () => {
  const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');

  if (!canvas || !canvas.getContext) {
    return;
  }
  
  const context = canvas.getContext('2d');
  
  if(!context) {
    return;
  }

  return context;
}


const render = (context: CanvasRenderingContext2D, player: any, food: any) => {
  const point = player.get_point();
  context.clearRect(0, 0, 500, 500);

  // draw player
  context.fillRect(point.get_x(), point.get_y(), WIDTH, HEIGHT);

  const body = player.get_body();

  body.forEach((element: any) => {
    context.fillRect(element.x, element.y, WIDTH, HEIGHT);
  });

  // draw food
  context.fillRect(food.get_x(), food.get_y(), WIDTH, HEIGHT);
}

bootstrap();