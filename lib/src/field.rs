use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Field {
  width: u32,
  height: u32,
}

#[wasm_bindgen]
impl Field {
  pub fn new(width: u32, height: u32) -> Field {
    Field { width, height }
  }

  pub fn get_width(&mut self) -> u32 {
    return self.width;
  }

  pub fn get_height(&mut self) -> u32 {
    return self.height;
  }
}
