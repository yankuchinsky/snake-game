mod utils;
mod player;
mod field;
mod point;

use point::Point;
use player::Player;
use field::Field;
use wasm_bindgen::prelude::*;
// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub struct Game {
  player: Player,
  point: Point,
  field: Field,
}

#[wasm_bindgen]
impl Game {
  pub fn new(player: Player, point: Point, field: Field) -> Game {
    Game { player, point, field }
  }

  pub fn get_player(self) -> Player {
    return self.player;
  }

  pub fn get_point(self) -> Point {
    return self.point;
  }

  pub fn get_field(self) -> Field {
    return self.field;
  }
}
