class Item {
  constructor(data) {
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.item_name = data.item_name;
    this.category = data.category;
    this.location = data.location;
    this.email = data.email;
    this.msg = data.msg;
    this.image_url = data.image_url;
    this.created_at = data.created_at;
  }
}

module.exports = Item;