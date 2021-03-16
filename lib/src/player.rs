use wasm_bindgen::prelude::*;
use crate::point::Point;

#[wasm_bindgen]
pub struct Player {
  point: Point,
  body: Vec<Point>,
}

#[wasm_bindgen]
impl Player {
  pub fn new(x: i32, y: i32) -> Player {
    let point = Point::new(x, y);
    let body = Vec::<Point>::new();
    
    Player { point, body }
  }

  pub fn collision_check(&mut self, x: i32, y: i32) -> bool{
    let s_x = self.point.get_x();
    let s_y = self.point.get_y();
    
    if s_x == x && s_y == y {
      self.add_to_body();
      
      return true;
    }

    return false;
  }

  pub fn get_body(&self) -> JsValue {
    JsValue::from_serde(&self.body).unwrap()
  }

  pub fn add_to_body(&mut self) {
    let point = Point::new(self.point.get_x(), self.point.get_y());
    self.body.push(point);
  }

  pub fn self_collision_check(&mut self) -> bool {
    for body_element in self.body.iter_mut() {
      if body_element.get_x() == self.point.get_x() && body_element.get_y() == self.point.get_y() {
        return true;
      }
    }

    return false;
  }

  pub fn get_point(&self) -> Point {
    self.point
  }

  fn move_body(&mut self, x: i32, y: i32) {
    if self.body.len() > 0 {

      let mut prev_x = x;
      let mut prev_y = y;

      for body_element in self.body.iter_mut() {
        let tmp_x = body_element.get_x();
        let tmp_y = body_element.get_y();

        body_element.set_x(prev_x);
        body_element.set_y(prev_y);
        
        prev_x = tmp_x;
        prev_y = tmp_y;
      }
    }
  }

  pub fn set_x(&mut self, x: i32) {
    self.move_body(self.point.get_x(), self.point.get_y());

    match self.point.get_x() {
      x if x < -250 => self.point.set_x(250),
      x if x > 250 => self.point.set_x(-250),
      _ =>  self.point.set_x(x),
    }
  }

  pub fn set_y(&mut self, y:i32) {
    self.move_body(self.point.get_x(), self.point.get_y());

    match self.point.get_y() {
      y if y < -250 => self.point.set_y(250),
      y if y > 250 => self.point.set_y(-250),
      _ => self.point.set_y(y),
    }
  }
}