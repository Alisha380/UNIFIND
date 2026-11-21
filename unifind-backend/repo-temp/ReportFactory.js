
class LostItem {
  constructor(data) {
    this.type = "Lost";
    this.name = data.name;
    this.item_name = data.item_name;
    this.location = data.location;
    this.email = data.email;
    this.msg = data.msg;
    this.image_url = data.image_url;
  }
}

class FoundItem {
  constructor(data) {
    this.type = "Found";
    this.name = data.name;
    this.item_name = data.item_name;
    this.location = data.location;
    this.email = data.email;
    this.msg = data.msg;
    this.image_url = data.image_url;
  }
}

class ReportFactory {
  static createReport(data) {
    if (data.type === "Lost") {
      return new LostItem(data);
    }

    if (data.type === "Found") {
      return new FoundItem(data);
    }

    throw new Error("Invalid report type");
  }
}

module.exports = ReportFactory;
