
module.exports = hbs => {
  hbs.registerHelper("each", (items, options) => {
    let out = "", count = 0;
    
    for (let i = 0, l = items.length; i < l; i++) {
      items[i].count = ++count;
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