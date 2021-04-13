const fs = require("fs");
const files = ["./public/data/schedules.json"];
for (const file of files) {
  const data = JSON.stringify(JSON.parse(fs.readFileSync(file, "utf8")));
  fs.writeFileSync(file, data);
}