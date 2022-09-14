const jsonServer = require("json-server");
const clonedData = require("./items.json");

const app = jsonServer.create();
const router = jsonServer.router(clonedData, { _isFake: true });
var brands = Object.keys(
  clonedData.items.reduce((r, row) => {
    r[row.manufacturer] = ++r[row.manufacturer] || 1;
    return r;
  }, {})
).map((key) => {
  return {
    key: key,
    value: clonedData.items
      .filter((x) => x.manufacturer)
      .reduce((r, row) => {
        r[row.manufacturer] = ++r[row.manufacturer] || 1;

        return r;
      }, {})[key],
  };
});

[{ key: "All", value: clonedData.items.length }, ...brands].forEach((a) => {
  clonedData.brands.push(a);
});
var countTag = 0;
var tags = Object.entries(
  clonedData.items.reduce((tags, item) => {
    item.tags.forEach((tag) => {
      countTag++;
      tags[tag] = tags[tag] || 0;
      tags[tag]++;
    });

    return tags;
  }, {})
).map(([key, value]) => ({ key, value }));
[{ key: "All", value: countTag }, ...tags].forEach((a) => {
  clonedData.tags.push(a);
});
app.use((req, res, next) => {
  if (req.path === "/") return next();

  router.db.setState(clonedData);
  next();
});
// app.get((req, res, next) => {
//   if()
// });

const isDevelopment = process.env.NODE_ENV !== "production";
app.use(
  jsonServer.defaults({
    logger: isDevelopment /* Falls as false with current config. */,
  })
);
app.use(router);
module.exports = app;
