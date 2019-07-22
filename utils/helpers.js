
module.exports = hbs => {
  hbs.registerHelper("each", (items, options) => {
    let out = "";
    for (let i = 0, l = items.length; i < l; i++) {
      out += options.fn(items[i]);
    }
    return out;
  });

  hbs.registerHelper("isEqual", (arg, options)=> {
    console.log(arg.code)
    if(arg.code === 200) {
      return options.fn(arg)
    }  
    return options.inverse(arg);
  })
}